# Getting Started with React + Typescript + ESLint + Prettier and Pre-commit hook Boilerplate

Yarn is used on this project, so I suggest you use yarn.
You can install yarn as globally with: `npm install --global yarn`

After installing yarn run `yarn install` to install the dependencies.

## Available Scripts

### `yarn start`

Runs the app in the development mode.
Open [http://localhost:3031](http://localhost:3031) to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.

### `yarn build`

Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!

### `yarn lint:fix`

Runs the ESLint linter on the project and if possible fixes the lint errors according to your config in .eslintrc.json file.

### `yarn format`

Runs the Prettier formatter on the project and format all the files according to your config in .prettierrc.json file.

### `yarn precommit`
- Runs the `lint-staged` and `husky` hooks before every commit.
- `lint-staged` runs the `yarn lint:fix` and `yarn format` commands on the files that are going to be committed.
- If there are any lint errors or formatting errors, the commit will be aborted.
