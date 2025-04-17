const express = require('express');
const Job = require('../models/job');
const Application = require('../models/application'); // Assuming you need this for application routes
const router = express.Router();

router.get('/', async (req, res) => {
  const jobs = await Job.getAll();
  res.json(jobs);
});

router.get('/:id', async (req, res) => {
  const job = await Job.getById(req.params.id);
  if (!job) return res.status(404).json({ message: 'Job not found' });
  res.json(job);
});

router.post('/', async (req, res) => {
  const jobId = await Job.create(req.body);
  res.status(201).json({ id: jobId, message: 'Job created successfully' });
});

router.post('/:id/apply', async (req, res) => {
  console.log('Job application submission request received:', {
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
    // First check if the job exists
    const job = await Job.getById(jobId);
    if (!job) {
      console.log('Job not found:', jobId);
      return res.status(404).json({ 
        message: 'Failed to submit application', 
        error: 'Job not found' 
      });
    }

    // If company_name is not provided in the request, get it from the job
    let companyName = company_name;
    if (!companyName) {
      companyName = job.company_name;
      console.log('Using company name from job:', companyName);
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

router.put('/:id', async (req, res) => {
  try {
    await Job.update(req.params.id, req.body);
    res.json({ message: 'Job updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update job', details: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const jobId = req.params.id;
    
    // First, delete all applications associated with this job
    await Application.deleteByJobId(jobId);
    
    // Delete the job
    await Job.delete(jobId);
    
    // Reset auto-increment counters for both tables
    await Job.resetAutoIncrement();
    await Application.resetAutoIncrement();
    
    res.json({ message: 'Job and associated applications deleted successfully, IDs reset' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete job', details: err.message });
  }
});

module.exports = router;
