PROJECT SETUP

**Requirements**: make sure you have Node.js installed and have updated npm. [Click here for instructions](https://docs.npmjs.com/getting-started/installing-node).


Next, ```cd``` inside the outer project directory and use npm to install all the dependencies included in the package.json file:

    $ npm install

This repository already includes a compiled ```dist``` package, but if you want to make changes to a view, you must edit either the html or js file for that view's component, located in ```src/components``` directory. After any changes made to the project, you must recompile by running:

    $ gulp

After building a component, make sure to add the new view to the router module in the router.js file and the Knockout components module in the startup.js file, both are in the ```app``` directory. Also, you have to add the file path of your new component to the ```include``` property in the gulpfile.js file.

For local development you just need to host the collection of static files contained in the **dist** directory, so treat that like a traditional static directory, and run with http-server via:

    $ http-server dist


For the live production example, the entire code repository was uploaded to an AWS S3 bucket but as mentioned the files in the ```dist``` directory are all that is needed, however these files are actually copied over into the root of the bucket so that the index.html is available (the actual project package is stored in a subdirectory in the bucket). So, the S3 bucket is actually organized like this:

```
23andmefrontend_deploy_v1/
css.css
fonts/
images/
index.html
scripts.js
```

To set this up on S3 properly you need to do a few things:

In the Permission tab, add a Grantee "Everyone" and check the List box. Next, add a bucket policy that looks like the following:

```
{
	"Version": "2012-10-17",
	"Id": "Policy1479987077386",
	"Statement": [
		{
			"Sid": "Stmt1479987075203",
			"Effect": "Allow",
			"Principal": "*",
			"Action": "s3:GetObject",
			"Resource": "arn:aws:s3:::[name of your S3 bucket]/*"
		}
	]
}
```

On the Static Website Hosting tab, select "Enable website hosting" and add ```index.html``` in the Index Document field.
