import { jido } from "jido";

export default jido({
  flows: [
    {
      name: 'publish',
      description: 'Push to GitHub and publish to NPM.',
      steps: [
        {
          run: 'git push'
        },
        {
          run: 'npm publish'
        }
      ]
    }
  ]
})
