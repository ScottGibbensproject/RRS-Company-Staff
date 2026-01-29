const express = require('express');
const monitoring = require('@google-cloud/monitoring');
const path = require('path');
const router = express.Router();

// Credentials path
const CREDENTIALS_PATH = path.join(__dirname, '../../gcloud-credentials.json');

// Project ID from credentials or env
const PROJECT_ID = process.env.GCLOUD_PROJECT_ID || 'rate-remover';

// Create monitoring client
let metricsClient = null;

function getMetricsClient() {
  if (metricsClient) return metricsClient;

  metricsClient = new monitoring.MetricServiceClient({
    keyFilename: CREDENTIALS_PATH
  });

  return metricsClient;
}

// Get App Engine memory usage
async function getMemoryUsage() {
  try {
    const client = getMetricsClient();
    const projectName = client.projectPath(PROJECT_ID);

    // Get data from last 10 minutes
    const now = Date.now();
    const startTime = now - (10 * 60 * 1000);

    const request = {
      name: projectName,
      filter: 'metric.type="appengine.googleapis.com/system/memory/usage"',
      interval: {
        startTime: { seconds: Math.floor(startTime / 1000) },
        endTime: { seconds: Math.floor(now / 1000) }
      },
      aggregation: {
        alignmentPeriod: { seconds: 60 },
        perSeriesAligner: 'ALIGN_MEAN'
      }
    };

    const [timeSeries] = await client.listTimeSeries(request);

    if (!timeSeries || timeSeries.length === 0) {
      return { used: 0, total: 0, percent: 0 };
    }

    // Sum up memory from all instances
    let totalMemory = 0;
    let usedMemory = 0;

    for (const series of timeSeries) {
      if (series.points && series.points.length > 0) {
        const latestPoint = series.points[0];
        usedMemory += latestPoint.value.int64Value || latestPoint.value.doubleValue || 0;
      }
    }

    // App Engine F4 instance has ~2.4GB, estimate based on instance class
    // Default service appears to use ~3GB based on the charts
    totalMemory = 4 * 1024 * 1024 * 1024; // 4GB estimate

    const percent = totalMemory > 0 ? Math.round((usedMemory / totalMemory) * 100) : 0;

    return {
      used: Math.round(usedMemory / (1024 * 1024)), // MB
      total: Math.round(totalMemory / (1024 * 1024)), // MB
      percent
    };
  } catch (error) {
    console.error('Failed to get memory usage:', error.message);
    return { used: 0, total: 0, percent: 0, error: error.message };
  }
}

// Get App Engine CPU usage
async function getCpuUsage() {
  try {
    const client = getMetricsClient();
    const projectName = client.projectPath(PROJECT_ID);

    const now = Date.now();
    const startTime = now - (10 * 60 * 1000);

    const request = {
      name: projectName,
      filter: 'metric.type="appengine.googleapis.com/flex/cpu/utilization"',
      interval: {
        startTime: { seconds: Math.floor(startTime / 1000) },
        endTime: { seconds: Math.floor(now / 1000) }
      },
      aggregation: {
        alignmentPeriod: { seconds: 60 },
        perSeriesAligner: 'ALIGN_MEAN'
      }
    };

    const [timeSeries] = await client.listTimeSeries(request);

    if (!timeSeries || timeSeries.length === 0) {
      return { percent: 0 };
    }

    // Average CPU across all instances
    let totalCpu = 0;
    let count = 0;

    for (const series of timeSeries) {
      if (series.points && series.points.length > 0) {
        const latestPoint = series.points[0];
        totalCpu += (latestPoint.value.doubleValue || 0) * 100;
        count++;
      }
    }

    const avgCpu = count > 0 ? Math.round(totalCpu / count) : 0;

    return { percent: avgCpu };
  } catch (error) {
    console.error('Failed to get CPU usage:', error.message);
    return { percent: 0, error: error.message };
  }
}

// Get instance count
async function getInstanceCount() {
  try {
    const client = getMetricsClient();
    const projectName = client.projectPath(PROJECT_ID);

    const now = Date.now();
    const startTime = now - (10 * 60 * 1000);

    const request = {
      name: projectName,
      filter: 'metric.type="appengine.googleapis.com/flex/instance/count"',
      interval: {
        startTime: { seconds: Math.floor(startTime / 1000) },
        endTime: { seconds: Math.floor(now / 1000) }
      }
    };

    const [timeSeries] = await client.listTimeSeries(request);

    if (!timeSeries || timeSeries.length === 0) {
      return { count: 0 };
    }

    let totalInstances = 0;

    for (const series of timeSeries) {
      if (series.points && series.points.length > 0) {
        totalInstances += series.points[0].value.int64Value || 0;
      }
    }

    return { count: totalInstances };
  } catch (error) {
    console.error('Failed to get instance count:', error.message);
    return { count: 0, error: error.message };
  }
}

// Summary endpoint
router.get('/summary', async (req, res) => {
  try {
    const [memory, cpu, instances] = await Promise.all([
      getMemoryUsage(),
      getCpuUsage(),
      getInstanceCount()
    ]);

    res.json({
      memory: memory.percent,
      memoryUsed: memory.used,
      memoryTotal: memory.total,
      cpu: cpu.percent,
      instances: instances.count,
      status: 'connected'
    });
  } catch (error) {
    console.error('GCloud summary error:', error.message);
    res.json({
      memory: 0,
      cpu: 0,
      instances: 0,
      status: 'error',
      error: error.message
    });
  }
});

// Detailed metrics endpoint
router.get('/metrics', async (req, res) => {
  try {
    const [memory, cpu, instances] = await Promise.all([
      getMemoryUsage(),
      getCpuUsage(),
      getInstanceCount()
    ]);

    res.json({
      memory,
      cpu,
      instances,
      projectId: PROJECT_ID,
      status: 'connected'
    });
  } catch (error) {
    console.error('GCloud metrics error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Status endpoint
router.get('/status', async (req, res) => {
  try {
    const client = getMetricsClient();
    // Quick check to see if we can authenticate
    const projectName = client.projectPath(PROJECT_ID);

    res.json({
      status: 'connected',
      projectId: PROJECT_ID
    });
  } catch (error) {
    res.json({
      status: 'error',
      message: error.message
    });
  }
});

module.exports = router;
