'use strict';

/**

	Usage:
	
	https://help-dev.ru/frontend/xhr-as-promise.html

*/

function uxRequest(params, timeout = 5000) {
	


	const xhrPromise = new Promise((resolve, reject) => {  
/*
		params = {
			...{
			'url': '', 
			'data': '', 
			'method': 'POST', 
			'headers': {},
			'credentials': false,
			'blob': false
			}, 
			...params
		}
*/

		params = Object.assign({
			'url': '', 
			'data': '', 
			'method': 'POST', 
			'headers': {},
			'credentials': false,
			'responseType':false
			},params);

		//if not url
		if (!params.url) reject({
			'description': 'not url'		
		});

		let xhr = new XMLHttpRequest();
		
		xhr.open(params.method, params.url);

		//adding headers
		for (let key in params.headers) {
			xhr.setRequestHeader(key, params.headers[key]) 
		}
		
		xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
		
		if (params.credentials) {
			xhr.withCredentials = true;
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

						   
							  
   

		
		if (params.responseType) {
			//if response must be BLOB
			if (params.responseType == 'blob') {
				xhr.responseType = "arraybuffer";
			} else {
				xhr.responseType = params.responseType;
			}
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
