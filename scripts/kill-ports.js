const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

async function killProcessOnPort(port) {
  try {
    // Find process using the port
    const { stdout } = await execAsync(`netstat -ano | findstr :${port}`);
    
    if (stdout.trim()) {
      console.log(`Found process using port ${port}`);
      
      // Extract PID from netstat output
      const lines = stdout.trim().split('\n');
      const pids = new Set();
      
      lines.forEach(line => {
        const parts = line.trim().split(/\s+/);
        const pid = parts[parts.length - 1];
        if (pid && !isNaN(pid)) {
          pids.add(pid);
        }
      });
      
      // Kill each process
      for (const pid of pids) {
        try {
          await execAsync(`taskkill /PID ${pid} /F`);
          console.log(`Killed process ${pid} using port ${port}`);
        } catch (error) {
          console.log(`Process ${pid} may have already been terminated`);
        }
      }
    } else {
      console.log(`No process found using port ${port}`);
    }
  } catch (error) {
    console.log(`No process found using port ${port}`);
  }
}

async function killPorts() {
  console.log('Checking for processes using development ports...');
  await killProcessOnPort(3000); // React dev server
  await killProcessOnPort(8000); // Express server
  console.log('Port cleanup completed');
}

killPorts().catch(console.error);