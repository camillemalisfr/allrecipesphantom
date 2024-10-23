# AllRecipes Phantom 👻

## How to use

Recommended Node Version : `v18`or later

### install dependencies

```
$ npm install
```

### add phantombuster.cson file

Add a `phantombuster.cson`file at the root of the project like this:

```
[
    name: 'YOUR_NAME'
    apiKey: 'YOUR_PHANTOMBUSTER_API_KEY'
    scripts:
        'my-script-name.js': 'dist/bundle.js'
]
```

Follow the [documentation](https://hub.phantombuster.com/docs/api#how-to-find-my-api-key) to find you API key.

### Development

Install the Phantombuster SDK package globally

```
$ npm install -g phantombuster-sdk
```

Then, for development, use the command:

```
$ npm run dev
```

This command concurrently runs 3 commands to:

- compile your code into JS (Phantoms only run in JS)
- bundle the compiled code into one file (bundle.js) using [Webpack](https://webpack.js.org/)
- publish it on PhantomBuster.

It runs on watch mode so it will run automatically everytime you add changes to the code.

Then go to your PhatomBuster Dashboard to create a Phantom using your custom script.

⚠️ Don't forget to release the new version of your code on https://phantombuster.com/dev

### Linter

This project uses [Eslint](https://eslint.org/) for linting the code. There is a pre-commit hook to prevent committing code that does not respect the linter's rule.
You can run the linter with the command `npm run lint`

## Retrieve API results

You can follow the [documentation](https://hub.phantombuster.com/reference/get_containers-fetch-result-object).
Call the PhantomBuster API like this:

```
curl --request GET \
     --url 'https://api.phantombuster.com/api/v2/containers/fetch-result-object?id=YOUR_CONTAINER_ID' \
     --header 'X-Phantombuster-Key: YOUR_API_KEY' \
     --header 'accept: application/json'
```
