let mealState = [];
let ruta = 'login' 
//login,register o 
let user = {}

const stringToHtml = (s) => { //8

    const parser = new DOMParser();//9
    const doc = parser.parseFromString(s, 'text/html');
    //10
    return doc.body.firstChild; //11

}

// Render de los meals 
const renderItem = (item) =>{ //6
    const elemento = stringToHtml(`<li data-id="${item._id}">${item.name}</li>`)//7
    elemento.addEventListener('click',() =>{
        const mealsList = document.getElementById('meals-list'); //3
        Array.from(mealsList.children).forEach(x => x.classList.remove('selected')); //17
        elemento.classList.add('selected'); //18
        const mealsIdInput = document.getElementById('meals-id-btn');//19
        mealsIdInput.value = item._id;//19
        console.log('mealsIdInput: ' + mealsIdInput)
        console.log('elemento: ' + elemento);
    })
    
    return elemento;
}

// Render de las Orders
const renderOrder = (order, meals) => { //25
    const meal = meals.find(meal => meal._id === order.meal_id)//26
    // console.log(meal)
    const element = stringToHtml(`<li data-id="${order._id}"> ${meal.name} - ${order.user_id}</li>`)//27
    return element;    
}
// ***************UNDER CONSTRUCTION *****************************************

const renderMeal = () => {
    console.log('nuevamente vamos')
    // const nameMeal = document.getElementById('name-meal')
    // const descMeal = document.getElementById('desc-meal')
    const mealsView = document.getElementById('meals-view');
    document.getElementById('app').innerHTML = mealsView.innerHTML
    const sendMealBtn =  document.getElementById('send-meal')
    console.log(sendMealBtn) 


    // // action
    sendMealBtn.addEventListener("click" , () =>{
        console.log('adentro de la funcion')
        const nameFood = entryText.value
        const descFood = entryDesc.value
        
        const infoMeal={
        name: nameFood,
        desc: descFood,
        }

        fetch('http://localhost:3000/api/meals',{
            method:'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(infoMeal)
        })
        .then(x => console.log(x))
            // .then(user => console.log(user))
            alert('Introduzca sus credenciales para crear el nuevo registro')
            renderLogin()            
            
        //.then(x => console.log(x))
            //renderLogin()
            //renderOrders()    
        
    })
        
}
   
 
        // const nameMeal = document.getElementById('nameMeal')
        // console.log(nameMeal)
        // const descMeal = document.getElementById('descMeal')
        // console.log(nameMeal)

    //     const entryBtn = document.getElementById('entry-btn');
    //     entryBtn.addEventListener('click', () =>{
    //         const nameFood = entryText.value;   
    //         const descFood = entryDesc.value;

    //         infoFood ={
    //            name: nameFood,
    //            desc: descFood,
    //         }
            
    //         fetch('http://localhost:3000/api/meals',{
    //             method:'POST',
    //             headers:{
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify(infoFood)
    //         })
    //         .then(x => console.log(x))
    //     })




// ***************************************************************************

const inicializaFormulario = () => {
    const token = localStorage.getItem('token') //agregado para resolver problema   
    const orderForm = document.getElementById('order');//28
    orderForm.onsubmit = (e) =>{ //29
    btn.setAttribute('disabled', true)
    e.preventDefault(); 
   
    const mealId = document.getElementById('meals-id-btn')//30
    mealIdValue = mealId.value; 
    if (!mealIdValue){ //31
        alert('Seleccione una opcion de comida');
        btn.removeAttribute('disabled')
        return;
    }
    const order = { //32
        meal_id: mealIdValue,
        user_id: user._id,
    }
// fetch de Post de orders
    fetch('http://localhost:3000/api/orders',{ //33
        method:'POST',
        headers:{
            'Content-Type': 'application/json',
            authorization: token,
        },
        body: JSON.stringify(order)
    })
    .then(x => x.json())
    .then(respuesta => {
        console.log(respuesta);
        console.log(mealState);
        const renderedOrder = renderOrder(respuesta, mealState);//34
        const orderList = document.getElementById('order-list');//35
        orderList.appendChild(renderedOrder);
        btn.removeAttribute('disabled')
    })
    }
    const entryMealBtn = document.getElementById('entryBtn')
    entryMealBtn.addEventListener("click", renderMeal)
}

const inicializaDatos = () => {
    // fetch de GET de las meals
    fetch('http://localhost:3000/api/meals') //1
    .then(response => response.json()) //2
    .then(data => {
        mealState = data;
        const mealsList = document.getElementById('meals-list'); //3
        const btn = document.getElementById('btn'); //4
        const listItems = data.map(renderItem); //5 
        mealsList.removeChild(mealsList.firstElementChild);//12
        listItems.forEach(element => { //13
            mealsList.appendChild(element); //14
        });
        btn.removeAttribute('disabled'); //15
        
        // fetch de GET de orders
        fetch('http://localhost:3000/api/orders')//20
        .then(response => response.json())
        .then(ordersData => {
            const orderList = document.getElementById('order-list');//21
            const listOrders = ordersData.map(orderData => renderOrder(orderData, data));//22
            orderList.removeChild(orderList.firstElementChild);//23
            listOrders.forEach(element => orderList.appendChild(element)); //24
                 
        })
    })

    
    
}

const renderApp = () => {
    const token = localStorage.getItem('token')
    if (token){
        user = JSON.parse(localStorage.getItem('user')) 
        console.log('token:' + token)
        return renderOrders()            
    }
    // alert('usuario no existe')
    renderLogin()
}

const renderOrders = () => {
    const ordersView = document.getElementById('orders-view')
    document.getElementById('app').innerHTML = ordersView.innerHTML
    inicializaFormulario()
    inicializaDatos()

}

const renderRegister = () =>{
    // console.log('funcionando')
    
    const registerView = document.getElementById('register-view')
    document.getElementById('app').innerHTML = registerView.innerHTML
    const registerForm = document.getElementById('register-form')
    
    
            
    registerForm.onsubmit = (e) => {
       
        e.preventDefault() //los onsubmit reciben un evento y debemos prevenirlos para no hacer refresh
        const nombre = document.getElementById('nombre').value
        const direccion = document.getElementById('direccion').value
        const email = document.getElementById('email').value
        const password = document.getElementById('password').value
        
        
        const user = {
                nombre: nombre,
                direccion: direccion,
                email: email,
                password: password,
            }

            console.log(user.nombre)
        fetch('http://localhost:3000/api/users/register',{ //33
            method:'POST',
            headers:{
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user)
    })
    .then(x => {
        console.log(x)
        fetch('http://localhost:3000/api/auth/login', {
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
            // body: JSON.stringify({ email: email, password: password }) Esto es lo mismo que lo de 
            //arriba pero como los nombres de la variables es el mismo se puede acortar  
        })
        .then( x => x.json())
        .then(response => {
            localStorage.setItem('token', response.token)
            ruta = 'orders'
            return response.token
            
        })
        alert('Registro exitoso, Inicia sesion con tus nuevas creadenciales')
        renderLogin()

}) 
}
}
    
    
const renderLogin = () =>{
    
    const loginView = document.getElementById('login-view')
    document.getElementById('app').innerHTML = loginView.innerHTML
    const loginForm = document.getElementById('login-form')
    
    loginForm.onsubmit = (e) => {
        
       
        e.preventDefault() //los onsubmit reciben un evento y debemos prevenirlos para no hacer refresh
        const email = document.getElementById('email').value
        const password = document.getElementById('password').value
        fetch('http://localhost:3000/api/auth/login', {
                method:'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
                // body: JSON.stringify({ email: email, password: password }) Esto es lo mismo que lo de 
                //arriba pero como los nombres de la variables es el mismo se puede acortar  
            })
            .then(res => {
                if (res.status == 404){
                    alert('usuario No encontrado')
                }
                return res.json()
            })
            .then(response => {
                localStorage.setItem('token', response.token)
                ruta = 'orders'
                return response.token
            })
            .then(token => {
                return fetch('http://localhost:3000/api/auth/me',{
                    method:'GET',
                    headers: {
                    'Content-Type': 'application/json',
                    authorization: token,
                },
            })
        })
        .then(x => x.json())
            // .then(user => console.log(user))
            .then(fetchedUser => {
                localStorage.setItem('user', JSON.stringify(fetchedUser) )
                user = fetchedUser
                renderOrders()            
            })
     }
        const regButton = document.getElementById('regB')
        regButton.addEventListener("click", renderRegister)

    }


    
window.onload = () => {
    renderApp()
}


//Explicacion
// 1.- Hacemos un fetch al Url de la aplicacion, buscando las meals
// 2.- La info fetcheada la guardamos en resposne y la pasamos a un json
// 3.- Traemos del DOM los elementos html 'meals list' 
// 4.- Traemos del DOM el input de tipo submit
// 5.- Hacemos un mapeo de toda la data que se vino en el fetch, llamamos a la funcion renderItem para renderizar cada uno de esos elementos 
// 6.- renderItem recibe el elemento y lo almacena en 'item' 
// 7.- Creamos una variable 'elemento' que va a contener la ejecucion de la funcion 'stringToHtml' y 
        //le pasamos como parametro una 'template string' con el elemento que queremnos crear en nuestro DOM. 
        //En esa template string enviamos dinamicamente el id y el nombre del elemento
// 8.- La funcion stringToHtml recibe el elemento string y lo guarda en 's'
// 9.- parser es una instancia de la clase DOMParser()
// 10.- usamos 'parser' para utilizar el metodo 'parseFromString' y convertir lo que tiene 's' en un hatml que estaremos guardando en la variable 'doc'
// 11.- 'doc' contiene ahora toda una estructiura html para cada elemento, retornamos el 1er elemento hijo de doc, el cual es el <li></li>
//12.- Para eliminar la etiqueta <p>Cargando...</p> eliminamos el 1er elemento html hijo de mealsList.
//13 y 14.- iteramos en el arreglo de elementos listItems y para cada uno de los elementos en el arreglo 
    //utilizamos el metodo appenChild() que nos permite crear un elemento html en el DOM.
//15.- El boton por defecto esta deshabilitado mientras la informacion carga en el DOM, con esta linea de codigo lo habilitamos quitandole ese atributo que hemos seteado en el html 
//16.- En la variable childrenArray estamos vaciando todos los elementos html que estamos
       //obteniendo de la linea anterior. childrenArray no es un arreglo como tal por lo tanto
       //debemos convertirlo en la siguiente linea.
//17.- Convertimos los elementos obtenidos en arreglo e iteramos con un forEach
       //para quitarles el atributo de 'selected' el cual será nuevamente colocado
       //en la linea en el item que hemos seleccionado en la linea siguiente
//18.- Despues de haberle quitado a todos los elementos del arreglo el atrbuto de
        //de 'selected' se lo colocamos nuevamente al elemento que hemos clickeado.
//19.- utilizamos el elemento input (hidden) del html para setearle el valor item._id
//20.- hacemos un fetch a la url de la aplicacion buscando las orders
//21.- traemos del DOM los elementos html 'order-list'
//22.- hacemos un mapeo de ordersData (que contiene las orders que fueron traidas por fetch),utilizamos el indice
        //orderData y llamamos a la funcion renderOrder enviado como parametros 'orderData' que contiene la info
        //de la orden(._id,meal_id,user_id) y data que contiene la informacion de la meal(._id,name,desc)  
//23.- Removemos el <p>Cargando...</p>
//24.- iteramos en el arreglo de elementos listOrders y para cada uno de los elementos en el arreglo 
        //utilizamos el metodo appenChild() que nos permite crear un elemento html en el DOM.
//25.- Aqui comienza la funcion de renderOrder, recibe como variables la order y las meals
//26.- Utilizamos el metodo find() para buscar en las meals el meal._id y compararlo con el meal_id 
        //que viene en la orden, si es igual entonces lo guardamos en la variable 'meal' 
//27.- Creamos una variable 'element' que va a contener la ejecucion de la funcion 'stringToHtml' y 
        //le pasamos como parametro una 'template string' con el elemento que queremnos crear en nuestro DOM. 
        //En esa template string enviamos dinamicamente: ${order._id}"> ${meal.name} - ${order.user_id}
 
//28.- Traemos del DOM los elementos html 'order' y lo guardamos en la variable 'orderForm'
//29.- Utilizamos 'orderForm' para utilizar el metodo 'onsubmit()' que no es mas que un escuchador de evento.
        //el evento lo pasamos como parametro y ejecutamos un preventDefault. Tambien deshabilitamos el boton
        //btn mientras se ejecuta el proceso.
//30.- nos traemos nuevamente el input de tipo hidden que usamos en el paso 19 pero esta vez ya viene con el 
        //valor de la meal (item._id), y lo guardamos en la variable mealId. Luego ese valor lo pasamos a otra 
        //variable 'mealIdValue' 

//31.- Hacemos un if para verificar que al momento que ejecutamos el onsubmit teniamos un mealIdValue válido
        //si no es asi entonces enviamos un mensaje de alerta para que este se seleccione.
//32.- Aqui armamos la orden como tal para la posterior creacion. La orden contiene: meal_id (que viene dentro
        //de la variable 'mealIdValue' e 'user_id' que hasta este momento es un valor String 

//33.- Hacemos un fetch de tipo POST a la url y le enviamos como body 'JSON.stringify(order)' que no es mas que
        //la orden convertida de objeto javaScript a una cadena de texto JSON.
//34.- Declaramos una variable 'renderedOrder' donde vamos a almacenar lo que se retorna de llamar a la  funcion
        //renderOrder que le pasamos como parametros respuesta: que no es mas que la orden convertida en JSON
        //y mealState que no es mas que un arreglo con las meals
//35.- Nos traemos los elementos 'order-list' del DOM y hacemos un appenChild de lo que tiene la variable
        //renderedorder que no es mas que la orden renderizada. Luego de esto removemos el atributo de disabled 
        //al boton 'btn' 
// ************************************************************************************************************


// *************** Entry Food  ***********************************
    // const entryForm = document.getElementById('entryForm');
    
    //     const entryText = document.getElementById('entryText');
    //     const entryDesc = document.getElementById('entryDesc');

    //     const entryBtn = document.getElementById('entry-btn');
    //     entryBtn.addEventListener('click', () =>{
    //         const nameFood = entryText.value;   
    //         const descFood = entryDesc.value;

    //         infoFood ={
    //            name: nameFood,
    //            desc: descFood,
    //         }
            
    //         fetch('http://localhost:3000/api/meals',{
    //             method:'POST',
    //             headers:{
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify(infoFood)
    //         })
    //         .then(x => console.log(x))
    //     })
        
    

// **************************************************
// Metodo basico para renderizar informacion traida desde un fetch de tipo GET
// metodo regular****************************************************************
// window.onload = () => {
//     fetch('http://localhost:3000/api/meals')
//     .then(response => response.json())
//     .then(data => {
//         const mealsList = document.getElementById('meals-list');
//         const mealsMap = data.map(t => '<li>' + t.name + '</li>').join('');
//         mealsList.innerHTML = mealsMap;
//     })
// }
// ********************************************************************************



