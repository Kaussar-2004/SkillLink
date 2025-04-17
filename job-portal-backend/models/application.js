const db = require('./db');

const Application = {
  // CREATE
  apply: async (job_id, applicant_name, email, company_name) => {
    try {
      // Validate inputs
      if (!job_id) throw new Error('Job ID is required');
      if (!applicant_name) throw new Error('Applicant name is required');
      if (!email) throw new Error('Email is required');
      
      // Convert job_id to number if it's a string
      const jobId = parseInt(job_id, 10);
      if (isNaN(jobId)) throw new Error('Invalid job ID');
      
      console.log('Submitting application with data:', { 
        job_id: jobId, 
        applicant_name, 
        email, 
        company_name 
      });
      
      const [result] = await db.query(
        `INSERT INTO applications (job_id, applicant_name, email, company_name)
         VALUES (?, ?, ?, ?)`,
        [jobId, applicant_name, email, company_name || null]
      );
      
      console.log('Application submitted successfully, ID:', result.insertId);
      return result.insertId;
    } catch (error) {
      console.error('Error in Application.apply:', error);
      throw error;
    }
  },

  // READ ALL
  getAll: async () => {
    const [rows] = await db.query(`
      SELECT a.*, j.job_title, j.company_name 
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      ORDER BY a.applied_at DESC
    `);
    return rows;
  },

  // READ ONE
  getById: async (id) => {
    const [rows] = await db.query(`
      SELECT a.*, j.job_title, j.company_name 
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      WHERE a.id = ?
    `, [id]);
    return rows[0];
  },

  // UPDATE
  update: async (id, updatedData) => {
    const { job_id, applicant_name, email, company_name } = updatedData;
    await db.query(
      `UPDATE applications
       SET job_id = ?, applicant_name = ?, email = ?, company_name = ?
       WHERE id = ?`,
      [job_id, applicant_name, email, company_name, id]
    );
  },

  // DELETE
  delete: async (id) => {
    await db.query('DELETE FROM applications WHERE id = ?', [id]);
  },
  
  // DELETE all applications for a job
  deleteByJobId: async (jobId) => {
    await db.query('DELETE FROM applications WHERE job_id = ?', [jobId]);
  },
  
  // Reset auto-increment after deletion
  resetAutoIncrement: async () => {
    await db.query('ALTER TABLE applications AUTO_INCREMENT = 1');
  }
};

module.exports = Application;
