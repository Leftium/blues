export async function post(requestEvent) {
    let body = await requestEvent.request.json();

    let params = body.formEntries;
    let fetchUrl = body.formAction + '?' + new URLSearchParams(params);
    let resp = await fetch(fetchUrl);

    return {
        status: resp.status,
        statusText: resp.statusText
    }
}