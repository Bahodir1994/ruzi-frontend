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
  }

]
