# AllRecipes Phantom 👻

## How to use

### install dependencies

```
$ npm install
```

### compile in Javascript code

Phantoms only run in JS, so you need to compile your code into JS before uploading it to PhantomBuster.
Use the following command:

```
$ tsc --watch
```

### add phantombuster.cson file

Add a `phantombuster.cson`file at the root of the project like this:

```
[
    name: 'YOUR_NAME'
    apiKey: 'YOUR_PHANTOMBUSTER_API_KEY'
    scripts:
        'my-script-name.js': 'dist/index.js'
]
```

Follow the [documentation](https://hub.phantombuster.com/docs/api#how-to-find-my-api-key) to find you API key.
This will allow you to publish the code on PhantomBuster by running the command:

```
$ npm install -g phantombuster-sdk
$ phantombuster
```

Then go to your PhatomBuster Dashboard to create a Phantom using your custom script.
