---
layout: post
title: "Revel static files and cache busting"
date: 2013-08-17 01:41
comments: true
categories: revel go
---

I needed a way to bust caches for static files in my revel applications, so I wrote this little template function that adds the md5 hashed file content as a query string to the filename. Check it out [here](https://github.com/dominicphillips/revel-staticfiles).

To use it in your project, "go get" it from github

```
$ go get github.com/dominicphillips/revel-staticfiles
```

Add it to your app.conf

```
* snip *
module.static=github.com/robfig/revel/modules/static
module.staticfiles=github.com/dominicphillips/revel-staticfiles
```

And finally, use the template tag
{% raw %}
``` html Add template tag
<link rel="stylesheet" type="text/css" href="{{ static "css/main.css" }}">
<script src="{{ static "js/app.js"}}"></script>
```
{% endraw %}

The md5 will be cached for the default caching duration of your app, remember to change cache.expires in accordingly.

If you're using nginx as a frontend proxy, set expires max.

```
location /public/ {
    alias /path/to/app/public/;
    if ($query_string) {
        expires max;
    }
}
```

Adding query strings to static files is kinda frowned upon[0](http://www.stevesouders.com/blog/2008/08/23/revving-filenames-dont-use-querystring/)[1](http://www.paulirish.com/2010/announcing-html5-boilerplate/#comment-34976), mostly due to not beeing cached by some proxies, but the amount of traffic you get from proxies should be pretty low.





