import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { loadSampleData, runTasks } from '../src/cli/lib';
import { startApp } from '../src/app';
import { spawn } from 'child_process';

(async () => {
  return MongoMemoryServer.create({ instance: { port: 27017 } });
})()
  .then((mongoServer) => {
    mongoose.connect(mongoServer.getUri() + "freesewing", { useNewUrlParser: true });
  })
  .then(() => { runTasks({ reboot: true }) })
  .then(loadSampleData)
  .then(startApp)
  .then(() => {
    spawn('npm', ['run', 'test'], { stdio: 'inherit' })
    .on('exit', function(code) {
      // Propagate the exit code.
      process.exit(code);
    });
  });
