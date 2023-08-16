const menu = document.querySelector('.header_menu');
const section = document.querySelector('.section');

function events() {
  const menu_open = document.querySelector('.menu_open');
  const menu_close = document.querySelector('.menu_close');
  const header_list = document.querySelector('.header_list');
  const car_button = document.querySelector('.car_button');
  const menu_car = document.querySelector('.menu_car');
  const modal = document.querySelector('.modal');
  
  menu_open.addEventListener('click', function() {
    header_list.classList.add('active');
    menu_open.classList.add('active');
    menu_close.classList.add('active');
  });
  
  menu_close.addEventListener('click', function() {
    header_list.classList.remove('active');
    menu_open.classList.remove('active');
    menu_close.classList.remove('active');
  });

  header_list.addEventListener('click', function() {
    header_list.classList.remove('active');
    menu_open.classList.remove('active');
    menu_close.classList.remove('active');
  });
  
  car_button.addEventListener('click', function() {
    menu_car.classList.toggle('active');
  });

  modal.addEventListener('click', function(){
    console.log('click en el modal');
    modal.classList.remove('active');
  })
}

function printProducts(db) {
  let html = '';
  for (const product of db.products) {
    html += `
      <div class="product">
        <div class="product_img">
          <img id="${product.id}" class="modal_img" src="${product.image}" alt=""/>
        </div>
        <div class="product_description">
          <h4>Nombre: ${product.name}</h4>
          <h3>USD $${product.price}</h3>
          <p>Stock: ${product.quantity}</p>
          <button id="${product.id}" class="btn_buy">Agegar al carrito</button>
        </div>
      </div>
    `
    section.innerHTML = html;
  }
}

function addToCar(db) {
  const productsHTML = document.querySelector('.section');
  productsHTML.addEventListener('click', function(event) {
    if(event.target.classList.contains('btn_buy')) {
      const id = Number(event.target.id);
      const productFind = db.products.find(function(product){
        return product.id === id;
      });
      if(db.car[productFind.id]) {
        db.car[productFind.id].amount++;
      } else {
        productFind.amount = 1;
        db.car[productFind.id] = productFind;
      }
      window.localStorage.setItem('car', JSON.stringify(db.car));
      printToCar(db);
      totalCar(db);
    }
  });
}

function printToCar(db) {
  const car_products = document.querySelector('.car_products');
  let html = '';
  for(const product in db.car) {
    //Se desestructura el objeto para acceder a sus atributos como variables
    const { quantity, price, name, image, id, amount } = db.car[product];
    html += `
      <div class="car_product">
        <div clas="car_product_image">
          <img src='${image}' alt="image product">
        </div>
        <div class="car_product_container">
          <div class="car_product_description">
            <h4>${name}</h4>
            <h3>Precio: $${price}</h3>
            <p>Stock: ${quantity}</p>
          </div>
          <div class="car_counter">
            <img id="${id}" class="btn_minus" src="./img/button_minus.png" alt="image minus">
            <span>${amount}</span>
            <img id="${id}" class="btn_plus" src="./img/button_plus.png" alt="image plus">
            <img id="${id}" class="trash" src="./img/trash.png" alt="image trash">
          </div>
        </div>
      </div>
    `;
  }
  car_products.innerHTML = html;
}

function handleCar(db) {
  const car_products = document.querySelector('.car_products');
  car_products.addEventListener('click', function(event) {
    if(event.target.classList.contains('btn_minus')) {
      const id = Number(event.target.id);
      const productFind = db.products.find(function(product){
        return product.id === id;
      });
      if(db.car[productFind.id]) {
        if(db.car[id].amount === 1) {
          return alert('Estas a punto de quitar del carrito');
        }
      }
      db.car[id].amount--;
    } else if(event.target.classList.contains('btn_plus')) {
      const id = Number(event.target.id);
      const productFind = db.products.find(function(product){
        return product.id === id;
      });
      if(db.car[productFind.id]) {
        if(productFind.quantity === db.car[productFind.id].amount) {
          return alert('No hay articulos en stock');
        }
      }
      db.car[id].amount++;
    } else if(event.target.classList.contains('trash')) {
      const id = Number(event.target.id);
      const response = confirm('Estas seguro que quieres quitar este producto del carrito');
      if(!response) {
        return;
      }
      delete db.car[id];
    }

    window.localStorage.setItem('car', JSON.stringify(db.car));
    printToCar(db);
    totalCar(db);
  });
}

function totalCar(db) {
  const info_total = document.querySelector('.info_total');
  const info_amount = document.querySelector('.info_total');
  let totalProducts = 0;
  let amountProducts = 0;

  for (const product in db.car) {
    amountProducts += db.car[product].amount;
    totalProducts += (db.car[product].amount * db.car[product].price);
  }
  console.log(amountProducts);
  info_amount.textContent = `Cantidad: ${amountProducts}`;
  info_total.textContent = `Total: $${totalProducts}`;
}

function buyCar(db) {
  const btnBuy = document.querySelector('.btn_buy');
  btnBuy.addEventListener('click', function(){    
    if(!Object.keys(db.car).length) {
      return alert('No hay articulos en el carrito de compras');
    };
    const response = confirm('¿Estas seguro que deseas confirmar la compra?');    
    if(!response) {
      return;
    }
    for (const product of db.products) {
      const carProduct = db.car[product.id];
      // ? = encadernamiento opcional
      //Sirve para evitar error cuando obtenemos un valor undefined 
      //y no se puede acceder a el atributo de un objeto
      //Se aplica ? a carProduct ya que no todos los elementos de la db.products 
      //existen en el db.car
      // ? ***************************
      if(product.id === carProduct?.id) {
        product.quantity -= carProduct.amount;
      }
    }
    db.car = {}; //Se limipia el carrito para sacar los articulos del db.car
    window.localStorage.setItem('products', JSON.stringify(db.products));
    window.localStorage.setItem('car', JSON.stringify(db.car));
    printProducts(db);
    printToCar(db);
    totalCar(db);
  });
}

function handleList(db) {
  const header_list_item = document.querySelectorAll('.header_list_item');
  header_list_item[0].addEventListener('click', function() {
    printProducts(db);
  });
  
  header_list_item[1].addEventListener('click', function() {
    let html = '';
    for (const product of db.products) {
      if(product.category === 'shirt') { //Validamos si el obj en la iteracion cumple la condicion para filtrar los productos
        html += `
          <div class="product">
            <div class="product_img">
              <img src="${product.image}" id="${product.id}" class="modal_img" alt=""/>
            </div>
            <div class="product_description">
              <h4>Nombre: ${product.name}</h4>
              <h3>Precio: $${product.price}</h3>
              <p>Stock: ${product.quantity}</p>
              <button id="${product.id}" class="btn_buy">Agegar al carrito</button>
            </div>
          </div>
        `
        section.innerHTML = html;
      }
    }
  });
  
  header_list_item[2].addEventListener('click', function() {
    let html = '';
    for (const product of db.products) {
      if(product.category === 'hoddie') { //Validamos si el obj en la iteracion cumple la condicion para filtrar los productos
        html += `
          <div class="product">
            <div class="product_img">
              <img src="${product.image}" id="${product.id}" class="modal_img" alt=""/>
            </div>
            <div class="product_description">
              <h4>Nombre: ${product.name}</h4>
              <h3>Precio: $${product.price}</h3>
              <p>Stock: ${product.quantity}</p>
              <button id="${product.id}" class="btn_buy">Agegar al carrito</button>
            </div>
          </div>
        `
        section.innerHTML = html;
      }
    }
  });
  
  header_list_item[3].addEventListener('click', function() {
    let html = '';
    for (const product of db.products) {
      if(product.category === 'sweater') { //Validamos si el obj en la iteracion cumple la condicion para filtrar los productos
        html += `
          <div class="product">
            <div class="product_img">
              <img src="${product.image}" id="${product.id}" class="modal_img" alt=""/>
            </div>
            <div class="product_description">
              <h4>Nombre: ${product.name}</h4>
              <h3>Precio: $${product.price}</h3>
              <p>Stock: ${product.quantity}</p>
              <button id="${product.id}" class="btn_buy">Agegar al carrito</button>
            </div>
          </div>
        `
        section.innerHTML = html;
      }
    }
  });
}

function printModalDetails(db) {
  const productsHTML = document.querySelector('.section');
  const modal_product = document.querySelector('.modal_product');
  const modal = document.querySelector('.modal');
  productsHTML.addEventListener('click', function(event) {
    if(event.target.classList.contains('modal_img')) {
      console.log(event.target);
      const id = Number(event.target.id);
      const productFind = db.products.find(function(product) {
        return product.id === id;
      });
      modal_product.innerHTML = `
        <div class="modal_img_product">
          <img src="${productFind.image}" alt="image product"/>
        </div>
        <div class="modal_group">
          <h3><span>Nombre:</span>${productFind.name}</h3>
          <h3><span>Descripción:</span>${productFind.description}</h3>
          <h3><span>Categoria:</span>${productFind.category}</h3>
          <h3><span>USD:</span>$${productFind.price} | <span>Stock:</span>${productFind.quantity}</h3>
        </div>
        <span>X</span>
      `
      modal.classList.add('active');
    }
  });
}


async function getApi() {
  const api_url = 'https://ecommercebackend.fundamentos-29.repl.co/';
  //const api_url = 'https://api.escuelajs.co/api/v1/products';
  try {
    const data = await fetch(api_url);
    const response = await data.json();
    window.localStorage.setItem('products', JSON.stringify(response));
    return response;
  } catch (error) {
    console.log(error);
  }
}

async function main() {
  const section = document.querySelector('.section');
  const db = {
    products: JSON.parse(window.localStorage.getItem('products')) || await getApi(),
    car: JSON.parse(window.localStorage.getItem('car')) || {}
  }
  //Detecta los eventos de los botones de menu de la pagina
  events();
  //Imprime las cards de los productos en venta
  printProducts(db);
  //Agrega los productos a la bd del carrito de compras
  addToCar(db);
  //Imprime la card de los articulos cargados al carrito
  printToCar(db);
  //Maneja los eventos del carrito de compras
  handleCar(db); 
  //Calcula los importes totales del carrito
  totalCar(db);
  //Maneja el proceso de compra
  buyCar(db);
  //Maneja los botones de navBar
  handleList(db);
  //Maneja el modal de detalles de producto
  printModalDetails(db)
}

main();