import express from 'express';
import bcrypt from 'bcrypt';
import { sendSecurityAlert } from '../config/mailer.js';

const router = express.Router();

// Helper to get geolocation
async function getGeoLocation(ip) {
  try {
    // If local, return placeholder
    if (ip === '::1' || ip === '127.0.0.1') return { country: 'Local', city: 'Development' };
    
    const response = await fetch(`http://ip-api.com/json/${ip}`);
    const data = await response.json();
    return {
      country: data.country || 'Unknown',
      city: data.city || 'Unknown'
    };
  } catch (error) {
    console.error('GeoIP Error:', error);
    return { country: 'Unknown', city: 'Unknown' };
  }
}

// Verify password
router.post('/login', async (req, res) => {
  const { password } = req.body;
  const ip = req.ip || req.headers['x-forwarded-for'] || '0.0.0.0';
  const userAgent = req.headers['user-agent'];

  if (!password) return res.status(400).json({ error: 'Password required' });

  try {
    const geo = await getGeoLocation(ip);
    
    // Get correct hash and recovery email
    const [authRows] = await req.db.query('SELECT password_hash, recovery_email FROM admin_auth LIMIT 1');
    if (authRows.length === 0) {
      return res.status(500).json({ error: 'Auth system not initialized' });
    }

    const match = await bcrypt.compare(password, authRows[0].password_hash);
    
    // Log attempt
    await req.db.query(
      'INSERT INTO security_logs (ip_address, is_successful, country, city, user_agent) VALUES (?, ?, ?, ?, ?)',
      [ip, match, geo.country, geo.city, userAgent]
    );

    if (match) {
      res.json({ success: true, message: 'Authenticated' });
    } else {
      // BRUTE FORCE DETECTION
      // Check for failed attempts from this IP in the last 10 minutes
      const [failures] = await req.db.query(
        'SELECT count(*) as count FROM security_logs WHERE ip_address = ? AND is_successful = 0 AND timestamp > DATE_SUB(NOW(), INTERVAL 10 MINUTE)',
        [ip]
      );

      const failedCount = failures[0].count;
      
      // TRIGGER EMAIL ALERT if threshold hit (e.g. 5 attempts)
      const alertEmail = process.env.RECOVERY_EMAIL || authRows[0].recovery_email;
      
      if (failedCount >= 5 && alertEmail) {
        // Trigger on multiples of 5 to notify periodic bursts without spamming every single failure
        if (failedCount % 5 === 0 || failedCount === 5) {
          sendSecurityAlert(alertEmail, {
            ip,
            country: geo.country,
            city: geo.city,
            attempts: failedCount
          });
        }
      }

      res.status(401).json({ success: false, message: 'Invalid credentials', failedAttempts: failedCount });
    }
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update password
router.put('/password', async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  
  try {
    const [rows] = await req.db.query('SELECT password_hash FROM admin_auth LIMIT 1');
    const match = await bcrypt.compare(currentPassword, rows[0].password_hash);
    
    if (!match) {
      return res.status(401).json({ error: 'Current password incorrect' });
    }

    const saltRounds = 10;
    const hash = await bcrypt.hash(newPassword, saltRounds);
    
    await req.db.query('UPDATE admin_auth SET password_hash = ? WHERE id = 1', [hash]);
    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update recovery email
router.put('/recovery-email', async (req, res) => {
  const { email } = req.body;
  try {
    await req.db.query('UPDATE admin_auth SET recovery_email = ? WHERE id = 1', [email]);
    res.json({ success: true, message: 'Recovery email updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get auth status (check if recovery email is set, etc)
router.get('/settings', async (req, res) => {
  try {
    const [rows] = await req.db.query('SELECT recovery_email FROM admin_auth LIMIT 1');
    res.json(rows[0] || { recovery_email: '' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
