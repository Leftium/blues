export async function post(requestEvent) {
    let body = await requestEvent.request.json();

    let params = body.formEntries;
    params.usp = 'pp_url';
    params.submit = 'Submit';

    let fetchUrl = body.formAction + '?' + new URLSearchParams(params);
    let resp = await fetch(fetchUrl);

    return {
        status: resp.status,
        statusText: resp.statusText
    }
}