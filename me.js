class PhoneBook{
    constructor(){
        this.add=this.add.bind(this);
        this.delete=this.delete.bind(this);
        this.edit=this.edit.bind(this);
        this.displayMatches=this.displayMatches.bind(this);
        this.contacts=[];
        this.me=document.querySelector("#phonebook tbody");
        this.search=document.querySelector(".search-form .search");
        this.tmpl=document.querySelector("#tmplPhoneBook").content.querySelector("tr");
        this.sortName=this.me.querySelector("#sortName");
        this.sortNumber=this.me.querySelector("#sortNumber");
        this.sortAddress=this.me.querySelector("#sortAddress");
        this.addForm=document.querySelector(".addForm");
        this.start();
    }
    start(){
        const endpoint='https://us-central1-johnbalvin.cloudfunctions.net/accescontrol?u=http://www.mocky.io/v2/581335f71000004204abaf83';
        fetch(endpoint,{method:"GET",mode:'cors'})
        .then(blob => {return blob.json();})
        .then(data => {
            for(let i=0,tam=data.contacts.length;i<tam;i++){
                let number=Math.floor(Math.random() * 100000000000000000000);
                data.contacts[i].id=number;
            }
        	this.contacts=data.contacts;
        	let contactsInfo=this.sortBefore(this.contacts);
        	this.displayData(contactsInfo);
        });
        const items =document.querySelectorAll(".item");
        for(let i=0,tam=items.length;i<tam;i++){
            const item=items[i];
            item.addEventListener("click",()=>{
                const img=item.querySelector(".nameOrder");
                if(this.me.dataset.sort==item.dataset.sortme){
                    if(item.dataset.sort=="0"){
                        item.dataset.sort="1";
                        img.style.transform="rotate(-180deg)";
                    }else{
                        item.dataset.sort="0";
                        img.style.transform="rotate(0deg)";
                    }
                }else{
                    img.style.display="flex";
                }
                for(let j=0,tam=items.length;j<tam;j++){
                    const item2=items[j];
                    if(i!=j){
                        item2.querySelector(".nameOrder").style.display="none";
                    }
                }
                this.me.dataset.sort=item.dataset.sortme;
                this.sortAfter();
            });
        }
        this.addForm.addEventListener("submit",this.add);
        const searchInput = document.querySelector('.search');
        searchInput.addEventListener('change', this.displayMatches);
        searchInput.addEventListener('keyup', this.displayMatches);
    }
    add(e){
        e.preventDefault();
        const name=this.addForm.querySelector(".name").value;
        const number=this.addForm.querySelector(".number").value;
        const address=this.addForm.querySelector(".address").value;
        let numberRandom=Math.floor(Math.random() * 100000000000000000000);
        this.contacts.push({"name":name,"address":address,"phone_number":number,"id":numberRandom});
        let contactsInfo=this.sortBefore(this.contacts);
        this.displayData(contactsInfo);
    }
    delete(e){
        let me=e.currentTarget.parentElement.parentElement.parentElement;
        let id=me.dataset.id;
        me.remove();
        this.contacts=this.contacts.filter(contact => contact.id==id ? false : true);
    }
    edit(e){
        let me=e.currentTarget.parentElement.parentElement.parentElement;
        let savebtn=me.querySelector(".actions .save");
        let cancelBtn=me.querySelector(".actions .cancel");
        let editBtn=me.querySelector(".actions .edit");
        let name=me.querySelector(".name");
        let number=me.querySelector(".number");
        let address= me.querySelector(".addres");
        const tmpName=name.textContent;
        const tmpNumber=number.textContent;
        const tmpAddress=address.textContent;
        name.contentEditable="true";
        number.contentEditable="true";
        address.contentEditable="true";
        name.focus();
        name.addEventListener("input",()=>{
            savebtn.style.display="flex";
            cancelBtn.style.display="flex";
            editBtn.style.display="none";   
        },{once:true});
        number.addEventListener("input",()=>{
            savebtn.style.display="flex";
            cancelBtn.style.display="flex";
            editBtn.style.display="none";   
        },{once:true});
        address.addEventListener("input",()=>{
            savebtn.style.display="flex";
            cancelBtn.style.display="flex";
            editBtn.style.display="none";   
        },{once:true});
        cancelBtn.addEventListener("click",()=>{
            name.textContent=tmpName;
            number.textContent=tmpNumber;
            address.textContent=tmpAddress;
            savebtn.style.display="none";
            cancelBtn.style.display="none";
            editBtn.style.display="flex";
            name.contentEditable="false";
            number.contentEditable="false";
            address.contentEditable="false";
        },{onde:true});
        savebtn.addEventListener("click",()=>{
            savebtn.style.display="none";
            cancelBtn.style.display="none";
            editBtn.style.display="flex";
            name.contentEditable="false";
            number.contentEditable="false";
            address.contentEditable="false";
            let id=me.dataset.id;
            for(let i=0,tam=this.contacts.length;i<tam;i++){
                if(this.contacts[i].id==id){
                    this.contacts[i].name=name.textContent;
                    this.contacts[i].phone_number=number.textContent;
                    this.contacts[i].address=address.textContent;
                    break;
                }
            }
        });
    }
    findMatches(wordToMatch, contacts) {
        return contacts.filter(contact => {
          const regex = new RegExp(wordToMatch, 'gi');
          return contact.name.match(regex) || contact.phone_number.match(regex) || contact.address.match(regex)
        });
    }
    displayMatches() {
        let matchArray = this.findMatches(this.search.value, this.contacts);
        this.displayData(matchArray);
    }
    sortAfter(){
        const contactsDom=document.querySelectorAll("table .contact");
        let contacts=[];
        for(let i=0,tam=contactsDom.length;i<tam;i++){
            let info=contactsDom[i];
            let name=info.querySelector(".name").textContent;
            let number=info.querySelector(".number").textContent;
            let address=info.querySelector(".addres").textContent;
            contacts.push({"name":name,"address":address,"phone_number":number,"id":info.dataset.id});
        }   
        let contactsInfo=this.sortBefore(contacts);
        this.displayData(contactsInfo);
    }
    sortBefore(contactsInfo){
        switch (this.me.dataset.sort){
            case "0":
                if(this.sortName.dataset.sort=="0"){
                  return contactsInfo.sort((a,b)=> a.name.toLowerCase() > b.name.toLowerCase() ? 1:-1);
                }
                return contactsInfo.sort((a,b)=> a.name < b.name ? 1:-1);
            case "1":
                if(this.sortNumber.dataset.sort=="0"){
                   return contactsInfo.sort((a,b)=> a.phone_number > b.phone_number ? 1:-1);
                }
                return contactsInfo.sort((a,b)=> a.phone_number < b.phone_number ? 1:-1);
            case "2":
                if(this.sortAddress.dataset.sort=="0"){
                    return contactsInfo.sort((a,b)=> a.address.toLowerCase() > b.address.toLowerCase() ? 1:-1);
                }
                return contactsInfo.sort((a,b)=> a.address.toLowerCase() < b.address.toLowerCase() ? 1:-1);        
        }
    }
    displayData(contactsInfo){
        const contacts=this.me.querySelectorAll("tr");
        for(let i=1,tam=contacts.length;i<tam;i++){
            contacts[i].remove();
        }
        for(let i=0,tam=contactsInfo.length;i<tam;i++){
            const info=contactsInfo[i];
            let nuevo=this.tmpl.cloneNode(true);
            nuevo.querySelector(".name").textContent=info.name;
            nuevo.querySelector(".number").textContent=info.phone_number;
            nuevo.querySelector(".addres").textContent=info.address;
            nuevo.querySelector(".actions .delete").addEventListener("click",this.delete);
            nuevo.querySelector(".actions .edit").addEventListener("click",this.edit);
            nuevo.dataset.id=info.id;
            this.me.appendChild(nuevo);
        }
    }
}
new PhoneBook();