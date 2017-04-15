<h1 align="center">
<img alt="jungledrom logo" src="https://github.com/hesselbom/jungledrum/raw/master/admin/static/logo.png" width="260" height="260">
<br />
jungledrum
<br/><br/>
</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/jungledrum"><img src="https://img.shields.io/npm/v/jungledrum.svg" alt="npm version"></a>
  <a href="https://standardjs.com"><img src="https://img.shields.io/badge/code_style-standard-brightgreen.svg" alt="Standard - JavaScript Style Guide"></a>
</p>
<br/>
<br/>

# What is this?
jungledrum is a super simple to use web server that aims to provide a CMS Admin to your frontend files.

Write your frontend as you always would and turn that into a cms. No more complicated templaing files or needing to write frontend twice!


# Install
Before installing you need to install [Node](https://nodejs.org/en/) (version 7+).
Then in commandline run
```
npm install -g jungledrum
```

# Run
In the commandline go into the directory of your frontend code and run `jungledrum`. A server should now be running on the port specified in your `.jungleconfig` (default: 3000)

# Setup
Running `jungledrum setup` in the commandline allows you to setup admin accounts for your cms. This is not required but extremely recommended to do.

Running setup when it has already been run before will override the previous setup.

# Clean
Running `jungledrum clean` will remove all traces of jungledrum. Use with caution.

It will remove the files/folders `.jungledb`, `.jungleconfig` and `.junglecompiled`.

# About
## Goal
The goal of the project is to go from frontend to a CMS with as little effort as possible. With this we have two main guidelines that all development should adhere to.

* As little config as possible
* Should be supersimple to use


# What happens
As a developer you probably want to know what is happening behind the scenes to have as little magic as possible. There are some hidden files and folders generated by jungledrum.
## Files created
### .jungledb
This file is created to store data and serves as the main database. This way no other application (like a SQL server) needs to be running for jungledrum to work.

### .jungleconfig
This file contains configuration of your website.

### .junglecompiled
This folder contains compiled static pages. To be able to serve them quickly and not recompile at every request. This gives both speed, stability and security.


# Config
Config for your website should be stored in `.jungleconfig`. Here is an example config with all available options:
```json
{
  "name": "Name of your website",
  "port": 3000,
  "adminurl": "_admin",
  "secret": "xxx",
  "uploads": "xxx"
}
```

# Admin
Admin can be found on an admin url while jungledrum is running. By default this is *http://localhost/_admin* but this could be changed in `.jungleconfig`

If `jungledrum setup` has not been run, or no "users" is found `.jungledb`, the admin won't require a login. It's recommended to run this setup though to add some admin users.

## PWA
The admin url is also a [Progressive Web App](https://developers.google.com/web/progressive-web-apps/). This means you can add your admin as a mobile app with "Add to Homescreen" on Android/iOS. Super simple admin, can be reached anywhere!

# Templates
All .html files will be treated as static files. If you want some templates with dynamic content you need to use some templating language. jungledrum supports several. Any file that is a template file (the ones supported is listed below) will be treated as a template.

### [Pug](https://pugjs.org/)
**File:** *.pug

Ignores files starting with underscore. I.e. _layout.pug

### [junglet](https://github.com/hesselbom/junglet)
**File:** *.junglet.html

## Template config
jungledrum will try to automatically find variables in a template and provide them as fields. If you need more than that you can supply a custom config for each template.

jungledrum will look for a json formatted config inside a `<jungledrum></jungledrum>` tag. This could be inside a block comment.

Here is an example config with all available options:
```json
{
  "name": "Name of template",
  "fields": [
    { "id": "preamble", "type": "text" },
    { "id": "content_a", "type": "textarea" },
    { "id": "content_b", "type": "markdown" },
    { "id": "avatar", "type": "image" },
    { "id": "file", "type": "file" },
    {
      "id": "type",
      "type": "select",
      "options": [
        { "id": "option1", "name": "Option 1" },
        { "id": "option2", "name": "Option 2" }
      ]
    },
    { "id": "onoff", "name": "On / Off", "type": "checkbox" },
    {
      "id": "object",
      "type": "object",
      "fields": [
        { "id": "name", "type": "text" },
        { "id": "avatar", "type": "image" }
      ]
    },
    {
      "id": "list_of_fields",
      "type": "list",
      "field": { "type": "text" }
    },
    {
      "id": "list_of_objects",
      "type": "list",
      "field": {
        "type": "object",
        "fields": [
          { "id": "name", "type": "text" },
          { "id": "avatar", "type": "image" }
        ]
      }
    }
  ]
}
```

## Template special variables
jungledrum will try to use every variable in a template as an admin input (or overriden by the template config). Some variables are always provided though. These are reserved words and can't be used as a custom variable. These are as follows:

`all_pages`
Provides an array of all pages to be able to list and filter pages. Usable for a menu for instance. The list looks something like this (where underscored variables are always provided and non-underscored are custom variables):

```json
[
  {
    "_id": 123,
    "_template": "template.pug",
    "_slug": "page-123",
    "_title": "My page",
    "fieldabc": "Field value",
    "fieldxyz": "Field value"
  }
]
```

`websitename`
The name of the website. The "name" field specified in .jungleconfig. Default is "jungledrum".

# 404 page
By default jungledrum will look for a 404.html (or a page with the slug "404") as a 404 Not Found page. If not found it will look for a general error.html (or a page with the slug "error").

# Deploying
Recommended way of running jungledrum on a server is through [forever](https://github.com/foreverjs/forever). Run the following command in your frontend directory and it should be up and running:
`forever start -c "jungledrum" .`

## nginx example config
If you're running jungledrum on default port 3000 you could use the following config for a simple HTTPS (with the snippets and ssl conf set up according to [this](https://www.digitalocean.com/community/tutorials/how-to-create-a-self-signed-ssl-certificate-for-nginx-in-ubuntu-16-04)):
```nginx
server {
    listen 80;
    listen [::]:80;
    server_name example.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    include snippets/ssl-server.example.com.conf;
    include snippets/ssl-params.conf;
    
    root /var/www/example.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    location ~ /.well-known {
        allow all;
    }
}
```

Or if HTTP (without SSL, not recommended) is enough for you, something like this would do:
```nginx
server {
    listen 80;
    server_name example.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

# Plugins
TODO: Write more about plugins
## Example custom field
```javascript
// plugins/example.js

plugins['example'] = {
  field: function () {
    return {
      getValue: function () {
        var input = this.dom.querySelector('input')
        return JSON.stringify({ text: input.value })
      },
      render: function (value) {
        var o = JSON.parse(value || '{}')
        return `<input value="${o.text || ''}" />`
      },
      setup: function (dom) {
        this.dom = dom
      }
    }
  }
}
```

# TODO
- Don't always compile to static, maybe allow dynamic pages
- Allow use of mongodb instead of .jungledb
- Write tests
