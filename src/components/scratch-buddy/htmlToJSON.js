const htmlToJSON = htmlToConvert => {
    const html = htmlToConvert.outerHTML;
    const data = {html};
    return data || '';
};

export default htmlToJSON;
