import {ApiUrls} from "./apiConfigDto";

export const apiConfigData: ApiUrls[] = [

  /** Module */
  {
    module: "items",
    // host: "http://192.168.224.38:9050",
    host: "http://localhost:9050",
    ssl: false,
    active: true,
    list: [
      {
        url: "/route-item/data-table-main",
        method: "post",
        label: "item_table",
        comment: "tovarlar asosy jadvali",
        active: true,
        showSuccess: false,
        showWarning: true,
        roles: []
      },
      {
        url: "/route-item/create",
        method: "POST",
        label: "item_create",
        comment: "yangi tovar qo'shish",
        active: true,
        showSuccess: true,
        showWarning: true,
        roles: []
      },
      {
        url: "/route-item/create-simple",
        method: "POST",
        label: "item_create_simple",
        comment: "yangi tovar qo'shish sodda",
        active: true,
        showSuccess: true,
        showWarning: true,
        roles: []
      }
    ]
  },
  {
    module: "category",
    // host: "http://192.168.224.38:9050",
    host: "http://localhost:9050",
    ssl: false,
    active: true,
    list: [
      /*todo info*/
      {
        url: "/route-category/data-table-main",
        method: "post",
        label: "category_table",
        comment: "categoriya asosy jadvali",
        active: true,
        showSuccess: false,
        showWarning: true,
        roles: []
      },
      {
        url: "/route-category/data-list-main",
        method: "post",
        label: "category_list",
        comment: "categoriya asosy ro'yxati",
        active: true,
        showSuccess: false,
        showWarning: true,
        roles: []
      },
      {
        url: "/route-category/create",
        method: "post",
        label: "create_category",
        comment: "guruh qoshish",
        active: true,
        showSuccess: true,
        showWarning: true,
        roles: []
      },
      {
        url: "/route-category/update",
        method: "patch",
        label: "update_category",
        comment: "guruhni ozgartirish",
        active: true,
        showSuccess: true,
        showWarning: true,
        roles: []
      }
    ]
  },
  {
    module: "units",
    // host: "http://192.168.224.38:9050",
    host: "http://localhost:9050",
    ssl: false,
    active: true,
    list: [
      {
        url: "/route-unit/data-table-main",
        method: "post",
        label: "unit_table",
        comment: "o'lchov birligi asosy jadvali",
        active: true,
        showSuccess: false,
        showWarning: true,
        roles: []
      },
      {
        url: "/route-unit/data-list-main",
        method: "get",
        label: "unit_list",
        comment: "o'lchov birligi asosy royxat",
        active: true,
        showSuccess: false,
        showWarning: true,
        roles: []
      }
    ]
  },
  {
    module: "purchase-order",
    // host: "http://192.168.224.38:9050",
    host: "http://localhost:9050",
    ssl: false,
    active: true,
    list: [
      {
        url: "/route-purchase-order/data-table-main",
        method: "post",
        label: "purchase_order_table",
        comment: "kirim asosy jadvali",
        active: true,
        showSuccess: false,
        showWarning: true,
        roles: []
      }
    ]
  },
  {
    module: "warehouse",
    // host: "http://192.168.224.38:9050",
    host: "http://localhost:9050",
    ssl: false,
    active: true,
    list: [
      {
        url: "/route-warehouse/data-table-main",
        method: "post",
        label: "warehouse_table",
        comment: "joylashuv asosy jadvali",
        active: true,
        showSuccess: false,
        showWarning: true,
        roles: []
      }
    ]
  },
  {
    module: "supplier",
    // host: "http://192.168.224.38:9050",
    host: "http://localhost:9050",
    ssl: false,
    active: true,
    list: [
      {
        url: "/route-supplier/data-table-main",
        method: "post",
        label: "supplier_table",
        comment: "taminotchi asosy jadvali",
        active: true,
        showSuccess: false,
        showWarning: true,
        roles: []
      }
    ]
  },
  {
    module: "stock",
    // host: "http://192.168.224.38:9050",
    host: "http://localhost:9050",
    ssl: false,
    active: true,
    list: [
      {
        url: "/route-stock/data-table-main",
        method: "post",
        label: "stock_table",
        comment: "stock asosy jadvali",
        active: true,
        showSuccess: false,
        showWarning: true,
        roles: []
      }
    ]
  },
  {
    module: "cart",
    // host: "http://192.168.224.38:9050",
    host: "http://localhost:9050",
    ssl: false,
    active: true,
    list: [
      {
        url: "/route-cart/create",
        method: "post",
        label: "create_cart",
        comment: "cart sessiya yaratish",
        active: true,
        showSuccess: false,
        showWarning: true,
        roles: []
      },
      {
        url: "/route-cart/add-item",
        method: "post",
        label: "add_item",
        comment: "cart sessiyada tovar qoshish",
        active: true,
        showSuccess: false,
        showWarning: true,
        roles: []
      },
      {
        url: "/route-cart/update-item",
        method: "post",
        label: "update_item",
        comment: "cart sessiyada tovar ni ozgartirish",
        active: true,
        showSuccess: false,
        showWarning: true,
        roles: []
      },
      {
        url: "/route-cart/update-item-price",
        method: "patch",
        label: "update_item_price",
        comment: "cart sessiyada tovar ni price ini ozgartirish",
        active: true,
        showSuccess: false,
        showWarning: true,
        roles: []
      },
      {
        url: "/route-cart/get-item",
        method: "get",
        label: "get_item",
        comment: "cart sessiya id boyicha  tovarlar ni olish",
        active: true,
        showSuccess: false,
        showWarning: true,
        roles: []
      },
      {
        url: "/route-cart/delete-item",
        method: "delete",
        label: "delete_item",
        comment: "cart sessiya da cart item boyicha ochirish",
        active: true,
        showSuccess: false,
        showWarning: true,
        roles: []
      },
      {
        url: "/route-cart/delete-cart",
        method: "delete",
        label: "delete_cart",
        comment: "cart sessiya ochirish",
        active: true,
        showSuccess: false,
        showWarning: true,
        roles: []
      },
      {
        url: "/route-cart/cancel-cart",
        method: "update",
        label: "cancel_cart",
        comment: "cart sessiya bekor qilish",
        active: true,
        showSuccess: false,
        showWarning: true,
        roles: []
      },
      {
        url: "/route-cart/add-customer-referrer",
        method: "patch",
        label: "add_customer_referrer",
        comment: "savatga mijoz/xamkor qoshish",
        active: true,
        showSuccess: false,
        showWarning: true,
        roles: []
      },
      {
        url: "/route-cart/remove-customer-referrer",
        method: "delete",
        label: "remove_customer_referrer",
        comment: "savatdan mijoz/xamkor ni olish",
        active: true,
        showSuccess: false,
        showWarning: true,
        roles: []
      },
    ]
  },
  {
    module: "customer",
    // host: "http://192.168.224.38:9050",
    host: "http://localhost:9050",
    ssl: false,
    active: true,
    list: [
      {
        url: "/route-customer/get-customers",
        method: "get",
        label: "get_customers",
        comment: "mijozlar royxati",
        active: true,
        showSuccess: false,
        showWarning: true,
        roles: []
      }
    ]
  },
  {
    module: "referrer",
    // host: "http://192.168.224.38:9050",
    host: "http://localhost:9050",
    ssl: false,
    active: true,
    list: [
      {
        url: "/route-referrer/get-referrers",
        method: "get",
        label: "get_referrers",
        comment: "xamkorlar royxati",
        active: true,
        showSuccess: false,
        showWarning: true,
        roles: []
      }
    ]
  },
  {
    module: "images",
    // host: "http://192.168.224.38:9050",
    host: "http://localhost:9050",
    ssl: false,
    active: true,
    list: [
      {
        url: "/route-file/crud",
        method: "post",
        label: "create_image",
        comment: "rasm saqlash",
        active: true,
        showSuccess: true,
        showWarning: true,
        roles: []
      },
      {
        url: "/route-file/crud",
        method: "get",
        label: "read_image",
        comment: "rasmlar ro'yxati (path lar)",
        active: true,
        showSuccess: false,
        showWarning: true,
        roles: []
      },
      {
        url: "/route-file/crud/page",
        method: "get",
        label: "image_table",
        comment: "rasmlar ro'yxati (page)",
        active: true,
        showSuccess: false,
        showWarning: true,
        roles: []
      },
      {
        url: "/route-file/crud",
        method: "get",
        label: "download_image",
        comment: "rasmni yukloab olish",
        active: true,
        showSuccess: true,
        showWarning: true,
        roles: []
      },
      {
        url: "/route-file/crud",
        method: "patch",
        label: "patch_image",
        comment: "rasm nomini ozgartirish",
        active: true,
        showSuccess: true,
        showWarning: true,
        roles: []
      },
      {
        url: "/route-file/crud",
        method: "delete",
        label: "delete_image",
        comment: "rasmni o'chirish",
        active: true,
        showSuccess: true,
        showWarning: true,
        roles: []
      }

    ]
  }
]
