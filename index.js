'use strict';

function uxRequest(params, timeout = 5000) {
	


	const xhrPromise = new Promise((resolve, reject) => {  

		params = Object.assign({
			'url': '', 
			'data': '', 
			'method': 'POST', 
			'headers': {},
			'credentials': false,
			'blob': false
			},params);

		//if not url
		if (!params.url) reject({
			'description': 'not url'		
		});

		let xhr = new XMLHttpRequest();
		xhr.open(params.method, params.url);

		//adding headers
		for(let key in params.headers){
			xhr.setRequestHeader(key, params.headers[key]) 
		}

		xhr.onreadystatechange = () => {

			if (xhr.readyState != 4) return;//do nothing

			if (xhr.status == 200) {
				resolve(xhr);
			} else {
				reject({
					'status': xhr.status,
					'statusText': xhr.statusText,
					'description': 'response error'
				});
			}
		};

		xhr.onerror = () => {
			reject({
				'status': xhr.status,
				'statusText': xhr.statusText,
				'description': 'load error'
			});
		};

		if (params.credentials) {
			xhr.withCredentials = true;
		}

		//if response must be BLOB
		if (params.blob) {
			xhr.responseType = "arraybuffer";
		}

		xhr.send(params.data);

	});

	const timeoutPromise = new Promise((resolve, reject) => {
		let id = setTimeout(() => {
			clearTimeout(id);
			reject({
				'description': 'timeout',
				'code':	504		
			})
		}, timeout)
	})


	return Promise.race([
		xhrPromise,
		timeoutPromise
	]);
}

export { uxRequest };
