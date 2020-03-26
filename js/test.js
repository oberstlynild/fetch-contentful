let content = [];
let wrapper = document.getElementById("wrapper");

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

async function writePagesToArray(data){
  for (var index=0; index<data.items.length; index++) {
    //content[index] = {title: data.items[index].fields.title["en-US"], date: data.items[index].fields.dato["en-US"], blog: data.items[index].fields.blog["en-US"]}
    if (data.items[index].fields.image) {
      let assetID = "https://api.contentful.com/spaces/7yo4dn79v7vy/environments/master/assets/" + data.items[index].fields.image["en-US"].sys.id
      await fetchAssets(assetID)
        .then(function(assetData) {
          content[index] = {title: data.items[index].fields.title["en-US"], dato: data.items[index].fields.dato["en-US"], image: assetData.fields.file["en-US"].url, blog: data.items[index].fields.blog["en-US"]}
        })
    }
    else {
      content[index] = {title: data.items[index].fields.title["en-US"], dato: data.items[index].fields.dato["en-US"], blog: data.items[index].fields.blog["en-US"]}
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

async function drawPage(){
  for (var i=0; i<content.length; i++) {
    let title = document.createElement("h1");
    title.textContent = content[i].title;
    wrapper.appendChild(title);

    let dato = document.createElement("p");
    dato.textContent = content[i].dato;
    wrapper.appendChild(dato);

    if (content[i].image) {
      let img = document.createElement("img");
      img.src = "https:" + content[i].image;
      wrapper.appendChild(img);
    }

    let blog = document.createElement("p");
    blog.textContent = content[i].blog;
    wrapper.appendChild(blog);

  }
}