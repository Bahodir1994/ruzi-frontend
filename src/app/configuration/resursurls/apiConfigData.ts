import {ApiUrls} from "./apiConfigDto";
import {environment} from '../../../environments/environment';

export const apiConfigData: ApiUrls[] = [

  /** Module */
  {
    module: "items",
    host: environment.baseUrl,
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
      },
      {
        url: "/route-item/create/xlsx",
        method: "POST",
        label: "item_create_xlsx",
        comment: "yangi tovarlarni xlsx dan qo'shish",
        active: true,
        showSuccess: true,
        showWarning: true,
        roles: []
      },
      {
        url: "/route-item/delete",
        method: "DELETE",
        label: "item_delete_one",
        comment: "bitta tovar ochirish",
        active: true,
        showSuccess: true,
        showWarning: true,
        roles: []
      },
      {
        url: "/route-item/delete",
        method: "POST",
        label: "item_delete_many",
        comment: "birnechta tovar ochirish",
        active: true,
        showSuccess: true,
        showWarning: true,
        roles: []
      },
      {
        url: "/route-item/update",
        method: "PUT",
        label: "item_update",
        comment: "tovarni ozgartirish",
        active: true,
        showSuccess: true,
        showWarning: true,
        roles: []
      },
      {
        url: "/route-item/search-item",
        method: "GET",
        label: "search_item",
        comment: "tovarni izlash",
        active: true,
        showSuccess: false,
        showWarning: true,
        roles: []
      }
    ]
  },
  {
    module: "category",
    host: environment.baseUrl,
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
      },
      {
        url: "/route-category/delete",
        method: "DELETE",
        label: "category_delete_one",
        comment: "bitta guruh ochirish",
        active: true,
        showSuccess: true,
        showWarning: true,
        roles: []
      },
      {
        url: "/route-category/delete",
        method: "POST",
        label: "category_delete_many",
        comment: "birnechta guruh ochirish",
        active: true,
        showSuccess: true,
        showWarning: true,
        roles: []
      },
    ]
  },
  {
    module: "units",
    host: environment.baseUrl,
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
    host: environment.baseUrl,
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
      },
      {
        url: "/route-purchase-order/data-table-pur-order",
        method: "post",
        label: "purchase_order_item_table",
        comment: "kirim tovar jadvali",
        active: true,
        showSuccess: false,
        showWarning: true,
        roles: []
      },
      {
        url: "/route-purchase-order/create-order",
        method: "POST",
        label: "pur_order_create",
        comment: "yangi kirim qo'shish",
        active: true,
        showSuccess: true,
        showWarning: true,
        roles: []
      },
      {
        url: "/route-purchase-order/read-order",
        method: "GET",
        label: "pur_order_read",
        comment: "kirimni o'qsh",
        active: true,
        showSuccess: false,
        showWarning: true,
        roles: []
      },
      {
        url: "/route-purchase-order/update-order",
        method: "PUT",
        label: "update_pur_order",
        comment: "kirimni yangilash",
        active: true,
        showSuccess: false,
        showWarning: true,
        roles: []
      },
      {
        url: "/route-purchase-order/delete-order",
        method: "delete",
        label: "delete_order",
        comment: "partiyani ochirish",
        active: true,
        showSuccess: true,
        showWarning: true,
        roles: []
      },
      {
        url: "/route-purchase-order/add-item",
        method: "post",
        label: "add_item",
        comment: "partiyaga tovar qoshish",
        active: true,
        showSuccess: false,
        showWarning: true,
        roles: []
      },
      {
        url: "/route-purchase-order/delete-order-item",
        method: "delete",
        label: "delete_order_item",
        comment: "partiyadan tovar ochirish",
        active: true,
        showSuccess: false,
        showWarning: true,
        roles: []
      },
      {
        url: "/route-purchase-order/update-order-item",
        method: "PATCH",
        label: "update_pur_order_item",
        comment: "kirim tovar maydonlarini yangilash",
        active: true,
        showSuccess: false,
        showWarning: true,
        roles: []
      }
    ]
  },
  {
    module: "warehouse",
    host: environment.baseUrl,
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
    host: environment.baseUrl,
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
    host: environment.baseUrl,
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
    host: environment.baseUrl,
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
    host: environment.baseUrl,
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
    host: environment.baseUrl,
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
    host: environment.baseUrl,
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
