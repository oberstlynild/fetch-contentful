let content = [];
let wrapper = document.getElementById("wrapper");
let embed = [];

fetchPage(`https://api.contentful.com/spaces/7yo4dn79v7vy/environments/master/entries/`)
    .then(data => writePagesToArray(data));

async function fetchPage(url) {
    let response = await fetch(url, {
        headers: {
            "authorization": "Bearer CFPAT-s4WrngXeOW4GO519eRwujfvmqo-MQNhLCrg68HZaEvc"
        }
    })
    let data = await response.json()
    return data;
}

async function writePagesToArray(data) {
    for (var index=0; index<data.items.length; index++) {
        if (data.items[index].fields.image) {
            embed[index] = data.items[index].fields.richblog["en-US"].content;
            let assetID = "https://api.contentful.com/spaces/7yo4dn79v7vy/environments/master/assets/" + data.items[index].fields.image["en-US"].sys.id
            await fetchAssets(assetID)
                .then(function(assetData) {
                    content[index] = {title: data.items[index].fields.title["en-US"], author: data.items[index].fields.author["en-US"], dato: data.items[index].fields.dato["en-US"], image: assetData.fields.file["en-US"].url, map: data.items[index].fields.map["en-US"]}
                })
            }
        else {
            embed[index] = data.items[index].fields.richblog["en-US"].content;
            content[index] = {title: data.items[index].fields.title["en-US"], author: data.items[index].fields.author["en-US"], dato: data.items[index].fields.dato["en-US"], map: data.items[index].fields.map["en-US"]}
        }
    }
    await drawPage();
}

async function fetchAssets(assetID) {
    let response = await fetch(assetID, {
        headers: {
            "authorization": "Bearer CFPAT-s4WrngXeOW4GO519eRwujfvmqo-MQNhLCrg68HZaEvc"
        }
    })
    let assetData = await response.json()
    return assetData;
}

async function drawPage() {
    for (var i=0; i<content.length; i++) {
        let page = document.createElement("div");
        page.className="page";
        
        let title = document.createElement("h1");
        title.textContent = content[i].title;
        page.appendChild(title);

        let author = document.createElement("p");
        author.textContent = content[i].author;
        page.appendChild(author);
        
        let dato = document.createElement("p");
        dato.textContent = content[i].dato;
        page.appendChild(dato);
        
        if (content[i].image) {
            let img = document.createElement("img");
            img.src = "https:" + content[i].image;
            page.appendChild(img);
        }

        if (content[i].map) {
            let iframe = document.createElement("iframe");
            iframe.setAttribute("frameborder", "0");
            iframe.setAttribute("width", "50%");
            iframe.setAttribute("height", "350");
            iframe.src= "https://www.google.com/maps/embed/v1/view?key=AIzaSyBknEYw17XNEnBPtjY2iEQp1pjh3-PoMoo&center=" + content[i].map.lat + "," + content[i].map.lon + "&zoom=18&maptype=satellite";
            page.appendChild(iframe);
        }
    
        for (var counter=0; counter<embed[i].length; counter++) {
            if (embed[i][counter].nodeType == "heading-2") {
                let h2 = document.createElement("h2");
                h2.textContent = embed[i][counter].content[0].value;
                page.appendChild(h2);
            }
            if (embed[i][counter].nodeType == "heading-3") {
                let h3 = document.createElement("h3");
                h3.textContent = embed[i][counter].content[0].value;
                page.appendChild(h3);
            }
            if (embed[i][counter].nodeType == "heading-4") {
                let h4 = document.createElement("h4");
                h4.textContent = embed[i][counter].content[0].value;
                page.appendChild(h4);
            }
            if (embed[i][counter].nodeType == "heading-5") {
                let h5 = document.createElement("h5");
                h5.textContent = embed[i][counter].content[0].value;
                page.appendChild(h5);
            }
            if (embed[i][counter].nodeType == "heading-6") {
                let h6 = document.createElement("h6");
                h6.textContent = embed[i][counter].content[0].value;
                page.appendChild(h6);
            }
            if (embed[i][counter].nodeType == "paragraph") {
                let preP = document.createElement("pre");
                for (var tal = 0; tal<embed[i][counter].content.length; tal++) {
                    page.appendChild(preP);
                    if(embed[i][counter].content[tal].marks.length){
                        if (embed[i][counter].content[tal].marks[0].type == "bold") {
                            let boldSpan = document.createElement("span");
                            boldSpan.className="bold-text";
                            boldSpan.textContent = embed[i][counter].content[tal].value;
                            preP.appendChild(boldSpan);
                        }
                        if (embed[i][counter].content[tal].marks[0].type == "italic") {
                            let italicSpan = document.createElement("span");
                            italicSpan.className="italic-text";
                            italicSpan.textContent = embed[i][counter].content[tal].value;
                            preP.appendChild(italicSpan);
                        }
                        if (embed[i][counter].content[tal].marks[0].type == "code") {
                            let codeSpan = document.createElement("span");
                            codeSpan.className="code-text";
                            codeSpan.textContent = embed[i][counter].content[tal].value;
                            preP.appendChild(codeSpan);
                        }
                    }
                    else {
                        let pSpan = document.createElement("span");
                        pSpan.textContent = embed[i][counter].content[tal].value;
                        preP.appendChild(pSpan);
                    }
                }
            }
            if (embed[i][counter].nodeType == "hr") {
                let hr = document.createElement("hr");
                page.appendChild(hr);
            }
            if (embed[i][counter].nodeType == "blockquote") {
                let preQ = document.createElement("pre");
                for (var omg = 0; omg<embed[i][counter].content.length; omg++) {
                    page.appendChild(preQ);
                    let quoteSpan = document.createElement("span");
                    let br = document.createElement("br");
                    quoteSpan.textContent = embed[i][counter].content[omg].content[0].value;
                    quoteSpan.className = "quote-text";
                    preQ.appendChild(quoteSpan);
                    preQ.appendChild(br);
                }
            }
            if (embed[i][counter].nodeType == "unordered-list") {
                let ul = document.createElement("ul");
                for (var ulListCounter = 0; ulListCounter<embed[i][counter].content.length; ulListCounter++) {
                    let li = document.createElement("li");
                    li.textContent = embed[i][counter].content[ulListCounter].content[0].content[0].value;
                    ul.appendChild(li);
                    console.log(embed[i][counter].content[ulListCounter].content[0].content[0].value)
                }
                page.appendChild(ul);
            }
            if (embed[i][counter].nodeType == "ordered-list") {
                let ol = document.createElement("ol");
                for (var olListCounter = 0; olListCounter<embed[i][counter].content.length; olListCounter++) {
                    let li = document.createElement("li");
                    li.textContent = embed[i][counter].content[olListCounter].content[0].content[0].value;
                    ol.appendChild(li);
                    console.log(embed[i][counter].content[olListCounter].content[0].content[0].value)
                }
                page.appendChild(ol);
            }
            wrapper.appendChild(page);
        }
    }
    console.log(embed);
}