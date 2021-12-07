"use strict";

//首頁跟後台拆開做

/*

戳所有產品API getProductsList() -> 取得產品資料
跑forEach 組字串-> 顯示產品資訊
select綁change監聽 -> 篩選產品資訊
*/
console.clear();
var apiPath = 'zengzeng';
var token = 'JZrWxOJ9QrMv7bwenU4Xp94h4M12';
var productsData = [];
var cartData = []; //DOM元素

var productList = document.querySelector('.productList');
var cartList = document.querySelector('.cartList');
var select = document.querySelector('.productCategory');
var deleteAllCartBtn = document.querySelector('.deleteAllCartBtn');
var thead = document.querySelector('.thead');
var tbody = document.querySelector('.tbody');
var tfoot = document.querySelector('.tfoot');
var cartTotalPrice = document.querySelector('.cartTotalPrice');
var shoppingCartList = document.querySelector('.shoppingCartList');
/*========================= 前台 =========================*/
//初始化

function init() {
  getProductsList();
  getCartsList();
}

;
init();
/*---------- 產品相關(客戶) ----------*/
// GET 取得產品列表 (v)

function getProductsList() {
  axios.get("https://livejs-api.hexschool.io/api/livejs/v1/customer/".concat(apiPath, "/products")).then(function (response) {
    // 成功會回傳的內容
    //console.log(response);
    productsData = response.data.products;
    renderProductsList();
  });
}

; //select 篩選產品列表 

select.addEventListener('change', function (e) {
  var category = e.target.value;

  if (category == '全部') {
    renderProductsList();
    return;
  } else {
    //🤔
    var str = '';
    productsData.forEach(function (item) {
      if (category == item.category) {
        str += "<li class=\"productCard\">\n          <h6 class=\"productType\">NEW</h6>\n          <img src=\"".concat(item.images, "\" alt=\"").concat(item.title, "\">\n          <a class=\"js-addCart\" data-id=\"").concat(item.id, "\">\u52A0\u5165\u8CFC\u7269\u8ECA</a>\n          <h5>").concat(item.title, "</h5>\n          <del class=\"originPrice h6\">NT$").concat(item.origin_price, "</del>\n          <h3 class=\"nowPrice\">NT$").concat(item.price, "</h3>\n      </li>");
      }
    });
    productList.innerHTML = str;
  }
}); //render產品列表 

function renderProductsList() {
  var str = '';
  productsData.forEach(function (item) {
    str += "<li class=\"productCard\">\n          <h6 class=\"productType\">NEW</h6>\n          <img src=\"".concat(item.images, "\" alt=\"").concat(item.title, "\">\n          <a class=\"js-addCart\" data-id=\"").concat(item.id, "\">\u52A0\u5165\u8CFC\u7269\u8ECA</a>\n          <h5>").concat(item.title, "</h5>\n          <del class=\"originPrice h6\">NT$").concat(item.origin_price, "</del>\n          <h3 class=\"nowPrice\">NT$").concat(item.price, "</h3>\n      </li>");
  });
  productList.innerHTML = str;
}
/*---------- 購物車相關(客戶) ----------*/
// GET 取得購物車列表 (v)


function getCartsList() {
  axios.get("https://livejs-api.hexschool.io/api/livejs/v1/customer/".concat(apiPath, "/carts")).then(function (response) {
    //判斷訂單內有無東西
    console.log('response.data', response.data);
    cartData = response.data.carts;
    console.log('cartData', cartData);
    console.log(cartData.length == 0); //沒東西

    if (cartData.length == 0) {
      thead.innerHTML = '';
      tfoot.innerHTML = '';
      tbody.innerHTML = "\n            <tr>\n      <td colspan=\"5\" class=\"text-center border-0\">\n          <p><a class=\"refreshBtn\"><span class=\"material-icons\"> refresh </span></a></p>\n              <p class=\"text-secondary\">\u76EE\u524D\u662F\u7A7A\u7684</p>\n              <p class=\"text-secondary\">\u7B49\u60A8\u5C07\u559C\u6B61\u7684\u5546\u54C1\u52A0\u9032\u8CFC\u7269\u8ECA\u5537 (\u3063\u02D8\u03C9\u02D8\u03C2 )</p>\n      </td>\n    \n    </tr>\n          ";
      var refreshBtn = document.querySelector('.refreshBtn');
      console.log(refreshBtn);
      refreshBtn.addEventListener('click', function (e) {
        e.preventDefault();
        getCartsList();
        alert("刷新！");
      });
      return;
    } // 有東西


    var str = '';
    var strHead = "<tr>\n                    <th width=\"40%\">\u54C1\u9805</th>\n                    <th width=\"15%\">\u55AE\u50F9</th>\n                    <th width=\"15%\">\u6578\u91CF</th>\n                    <th width=\"15%\">\u91D1\u984D</th>\n                    <th width=\"15%\"></th>\n                </tr>";
    var strFoot = "\n                    <td>\n                        <a href=\"#\" class=\"deleteAllCartBtn\">\u522A\u9664\u6240\u6709\u54C1\u9805</a>\n                    </td>\n                    <td></td>\n                    <td></td>\n                    <td>\n                        <p class=\"cartTotal-Text\">\u7E3D\u91D1\u984D</p>\n                    </td>\n                    <td class=\"cartTotalPrice\">\n                      NT$".concat(response.data.finalTotal, "\n                    </td> \n    ");
    cartData.forEach(function (item) {
      str += "\n      <tr>\n        <td>\n            <div class=\"cardItem-title\">\n                <img src=\"".concat(item.product.images, "\" alt=\"\">\n                <p class=\"cartItem-name\">").concat(item.product.title, "</p>\n            </div>\n        </td>\n        <td class=\"cartItem-price\">NT$").concat(item.product.price, "</td>\n        <td class=\"cartItem-num\">").concat(item.quantity, "</td>\n        <td class=\"cartItem-price\">NT$").concat(item.product.price * item.quantity, "</td>\n        <td class=\"text-end\">\n        <a href=\"#\" class=\"material-icons discardBtn\" data-id=\"").concat(item.id, "\">clear</a>\n        </td>\n    </tr>");
    }); //cartTotalPrice.innerHTML = `NT$${response.data.finalTotal}`;

    thead.innerHTML = strHead;
    tbody.innerHTML = str;
    tfoot.innerHTML = strFoot; //console.log(str);
  });
}

; // POST 加入購物車(v)

productList.addEventListener('click', function (e) {
  e.preventDefault(); //消除預設行為

  var addCartClass = e.target.getAttribute('class');
  console.log(addCartClass);
  console.log(addCartClass !== "js-addCart");

  if (addCartClass !== "js-addCart") {
    return;
  }

  var ProductId = e.target.getAttribute('data-id');
  addItemToCart(ProductId);
});

function addItemToCart(ProductId) {
  var ProductNum = 1;
  cartData.forEach(function (item) {
    if (ProductId == item.product.id) {
      ProductNum = item.quantity += 1;
    }
  });
  axios.post("https://livejs-api.hexschool.io/api/livejs/v1/customer/".concat(apiPath, "/carts"), {
    data: {
      "productId": ProductId,
      "quantity": ProductNum
    }
  }).then(function (response) {
    alert('加入購物車成功');
    init();
    getCartsList();
    console.log(response.data);
  });
}

; // DELETE 刪除購物車內特定產品 (v)

tbody.addEventListener('click', function (e) {
  e.preventDefault();
  var cartId = e.target.getAttribute('data-id');
  console.log('點到囉');
  console.log(cartId);

  if (cartId == null) {
    return;
  } else {
    axios["delete"]("https://livejs-api.hexschool.io/api/livejs/v1/customer/".concat(apiPath, "/carts/").concat(cartId)).then(function (response) {
      // 成功會回傳的內容
      console.log(response.data);
      alert('刪除成功');
      getCartsList();
    });
  }
}); // DELETE 清空購物車產品 (v)

tfoot.addEventListener('click', function (e) {
  e.preventDefault();
  var cartCalss = e.target.getAttribute('class');
  console.log('tfoot');
  console.log(cartCalss);

  if (cartCalss == 'deleteAllCartBtn') {
    console.log('刪除中');
    axios["delete"]("https://livejs-api.hexschool.io/api/livejs/v1/customer/".concat(apiPath, "/carts")).then(function (response) {
      // 成功會回傳的內容
      console.log('cart_success', response.data);
      alert('全部刪光光');
      getCartsList();
    })["catch"](function (error) {
      alert('購物車已經是空的囉');
      console.log('cart_error', error.data);
    });
  }
}); //deleteAllCartBtn.addEventListener('click',deleteAllItemsFromCart)
// function deleteAllItemsFromCart(e){
//   e.preventDefault();
//   axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${apiPath}/carts`)
//   .then(function (response) {
//     // 成功會回傳的內容
//     console.log('cart_success', response.data);
//     alert('全部刪光光');
//     getCartsList();
//   })
//   .catch(function (error) {
//     alert('購物車已經是空的囉')
//     console.log('cart_error', error.data);
//   })
// };
// /*---------- 訂單相關(客戶) ----------*/

var form = document.querySelector(".addTicket-form");
var inputs = document.querySelectorAll("input[type = text], input[type = tel], select");
var msg = document.querySelectorAll('.messages');
var sendOrderBtn = document.querySelector('.sendOrder');
var orderName = document.querySelector('.orderName');
var orderTel = document.querySelector('.orderTel');
var orderEmail = document.querySelector('.orderEmail');
var orderAddress = document.querySelector('.orderAddress');
var orderPayment = document.querySelector('.orderPayment'); // //監聽後觸發防空值判斷
// //防空值 -> 購物車列表 & 表單欄位
// //若無空值 -> 戳送出訂單的API
// POST 送出購買定單 (v)先放棄驗證QQ

sendOrderBtn.addEventListener('click', function () {
  var carthLength = document.querySelectorAll(".tbody td").length;
  console.log(carthLength);

  if (carthLength == 0) {
    alert("當前購物車內沒有產品，所以無法送出訂單 RRR ((((；゜Д゜)))");
    return;
  }

  ;

  if (orderName.value == "" || orderTel.value == "" || orderEmail.value == "" || orderAddress.value == "") {
    alert("客戶資訊尚未填寫 ((((；゜Д゜)))");
    return;
  }

  var orderData = {
    name: orderName.value,
    tel: orderTel.value,
    email: orderEmail.value,
    address: orderAddress.value,
    payment: orderPayment.value
  };
  sentOrderList(orderData);
  form.reset(); //一鍵清除
  //validateForm();
  //alert("請確認所有欄位是否填寫正確唷");
}); // /*
// //表單驗證 validata.js
// const constraints = {
// 	姓名:{   //抓input裡name的值
// 		presence: {
//       message: "是必填欄位"
//     }, //presence 為欄位必填的驗證
// 	},
// 	電話:{
// 		presence: {
//       message: "是必填欄位"
//     },
// 	},
// 	Email:{   
// 		presence: {
// 	    message: "是必填欄位"
// 	  }, 
//     email: true
// 	},
// 	地址:{   
// 		presence: {
// 	message: "是必填欄位"
// 	}, 
// 	},
// }
// //將validate套件錯誤訊息裡的英文轉換為中文
// let translation = {
//   姓名: "name",
//   電話: "tel",
//   Email: "email",
//   地址: "address",
// };
// //欄位驗證函式
// function validateForm(){
//   //預設為空值
//   cleanErrorMsg();
//   inputs.forEach((item) => {
//     let errors = validate(form, constraints); // 驗證回傳的內容
//     console.log('errors1',errors);
//     if (errors) {
//       Object.keys(errors).forEach(function (keys) {
//         console.log('errors2',errors);
//         const msgText = document.querySelector(`.${translation[keys]}`);
//         msgText.textContent = errors[keys];
//       });
//     }
//   });
// }
// //清空錯誤訊息
// function cleanErrorMsg(){
//   msg.forEach(function(item,inex){
//   item.textContent = ""; 
//   });
// };
// */

function sentOrderList(item) {
  axios.post("https://livejs-api.hexschool.io/api/livejs/v1/customer/".concat(apiPath, "/orders"), {
    data: {
      user: {
        name: item.name,
        tel: item.tel,
        email: item.email,
        address: item.address,
        payment: item.payment
      }
    }
  }).then(function (response) {
    console.log('success', response.data);
    alert('訂單建立成功');
    getCartsList();
  })["catch"](function (error) {
    console.log('error.response.data', error.response.data);
    console.log('error.response.data.message', error.response.data.message);
  });
}
//# sourceMappingURL=all.js.map
