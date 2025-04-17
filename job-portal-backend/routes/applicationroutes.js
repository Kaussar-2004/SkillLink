const express = require('express');
const Application = require('../models/application');
const router = express.Router();

router.post('/:id/apply', async (req, res) => {
  console.log('Application submission request received:', {
    body: req.body,
    params: req.params
  });
  
  const { applicant_name, email, company_name } = req.body;
  const jobId = req.params.id;
  
  // Validate required fields
  if (!applicant_name || !email) {
    console.log('Missing required fields');
    return res.status(400).json({ 
      message: 'Failed to submit application', 
      error: 'Applicant name and email are required' 
    });
  }
  
  try {
    // If company_name is not provided in the request, get it from the job
    let companyName = company_name;
    if (!companyName) {
      console.log('Company name not provided, fetching from job');
      const Job = require('../models/job');
      const job = await Job.getById(jobId);
      if (job) {
        companyName = job.company_name;
        console.log('Found company name:', companyName);
      } else {
        console.log('Job not found');
        return res.status(404).json({ 
          message: 'Failed to submit application', 
          error: 'Job not found' 
        });
      }
    }

    console.log('Calling Application.apply with:', { jobId, applicant_name, email, companyName });
    const id = await Application.apply(jobId, applicant_name, email, companyName);
    console.log('Application submitted successfully, ID:', id);
    res.status(201).json({ id, message: 'Application submitted successfully' });
  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).json({ 
      message: 'Failed to submit application', 
      error: error.message 
    });
  }
});

router.get('/', async (req, res) => {
  console.log('GET /api/applications hit');
  const apps = await Application.getAll();
  res.json(apps);
});

router.get('/:id', async (req, res) => {
  const app = await Application.getById(req.params.id);
  if (!app) return res.status(404).json({ message: 'Application not found' });
  res.json(app);
});

router.put('/:id', async (req, res) => {
  try {
    await Application.update(req.params.id, req.body);
    res.json({ message: 'Application updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update application', details: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Application.delete(req.params.id);
    
    // Reset auto-increment after deletion
    await Application.resetAutoIncrement();
    
    res.json({ message: 'Application deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete application', details: err.message });
  }
});


module.exports = router;
