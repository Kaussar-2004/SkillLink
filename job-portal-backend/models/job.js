const db = require('./db');

const Job = {
  async getAll() {
    const [rows] = await db.query('SELECT * FROM jobs');
    return rows;
  },

  async getById(id) {
    const [rows] = await db.query('SELECT * FROM jobs WHERE id = ?', [id]);
    return rows[0];
  },

  async create(jobData) {
    const {
      job_title,
      job_description,
      company_name,
      location,
      job_type,
      salary_range,
      application_deadline
    } = jobData;

    // Format application_deadline to YYYY-MM-DD
    const formattedDeadline = new Date(application_deadline).toISOString().split('T')[0];

    const [result] = await db.query(
      `INSERT INTO jobs 
        (job_title, job_description, company_name, location, job_type, salary_range, application_deadline) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [job_title, job_description, company_name, location, job_type, salary_range, formattedDeadline]
    );

    return result.insertId;
  },

  async update(id, jobData) {
    const {
      job_title,
      job_description,
      company_name,
      location,
      job_type,
      salary_range,
      application_deadline
    } = jobData;

    // Format application_deadline to YYYY-MM-DD
    const formattedDeadline = new Date(application_deadline).toISOString().split('T')[0];

    await db.query(
      `UPDATE jobs 
       SET job_title = ?, job_description = ?, company_name = ?, location = ?, 
           job_type = ?, salary_range = ?, application_deadline = ? 
       WHERE id = ?`,
      [job_title, job_description, company_name, location, job_type, salary_range, formattedDeadline, id]
    );
  },

  async delete(id) {
    await db.query('DELETE FROM jobs WHERE id = ?', [id]);
  },
  
  // Reset auto-increment counter for jobs table
  async resetAutoIncrement() {
    await db.query('ALTER TABLE jobs AUTO_INCREMENT = 1');
  }
};

module.exports = Job;
