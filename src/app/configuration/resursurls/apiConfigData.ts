import {ApiUrls} from "./apiConfigDto";

export const apiConfigData: ApiUrls[] = [

  /** Module */
  {
    module: "warehouse",
    // host: "http://192.168.224.38:9050",
    host: "http://localhost:9050",
    ssl: false,
    active: true,
    list: [
      /*todo info*/
      {
        url: "/api/purchase-orders/read-table-data",
        method: "post",
        label: "purchase_order_table",
        comment: "ombor prixodlari jadvali",
        active: true,
        showSuccess: false,
        showWarning: true,
        roles: []
      },


      {
        url: "/route-bnt/crud/bnt/info/private",
        method: "get",
        label: "bnt_info",
        comment: "bnt statistikasi",
        active: true,
        showSuccess: false,
        showWarning: true,
        roles: ["ROLE_BNT_READ_FULL"]
      },
      {
        url: "/route-bnt/table-bnt/data-table-main",
        method: "post",
        label: "d_t_main",
        comment: "bnt jadvali",
        active: true,
        showSuccess: false,
        showWarning: true,
        roles: ["ROLE_BNT_READ"]
      },
      {
        url: "/route-bnt/table-bnt/data-table-main/private",
        method: "post",
        label: "d_t_main",
        comment: "bnt jadvali",
        active: true,
        showSuccess: false,
        showWarning: true,
        roles: ["ROLE_BNT_READ_FULL"]
      },
      {
        url: "/route-bnt/table-bnt/data-table-cmdt",
        method: "post",
        label: "d_t_cmdt",
        comment: "bnt tovar jadvali",
        active: true,
        showSuccess: false,
        showWarning: true,
        roles: []
      },
      {
        url: "/route-bnt/table-bnt/data-table-cmdt-child",
        method: "post",
        label: "d_t_cmdt_child",
        comment: "bnt tovar qarorlari jadvali",
        active: true,
        showSuccess: false,
        showWarning: true,
        roles: []
      },
      {
        url: "/route-bnt/table-bnt/data-table-cmdt-sample",
        method: "post",
        label: "d_t_cmdt_sample",
        comment: "bnt tovar namunalari jadvali",
        active: true,
        showSuccess: false,
        showWarning: true,
        roles: []
      },
      {
        url: "/route-bnt/table-bnt/data-table-bnt-doc",
        method: "post",
        label: "d_t_doc",
        comment: "bnt xujjatlar jadvali",
        active: true,
        showSuccess: false,
        showWarning: true,
        roles: []
      },
      {
        url: "/route-bnt/crud/app-update/v1",
        method: "PATCH",
        label: "update_bnt_app_status",
        comment: "bnt statusini ozgartirish kiritish",
        active: true,
        showSuccess: true,
        showWarning: true,
        roles: ['ROLE_BNT_UPDATE']
      },
      {
        url: "/route-bnt/crud/app-update/v2",
        method: "PATCH",
        label: "update_bnt_app_status",
        comment: "bnt statusini ozgartirish kiritish",
        active: true,
        showSuccess: true,
        showWarning: true,
        roles: ['ROLE_BNT_UPDATE_FULL']
      },
      {
        url: "/route-bnt/crud/app-update/v3",
        method: "PATCH",
        label: "finish_bnt_app_decision",
        comment: "bnt statusini yakunlash qaror chiqarish",
        active: true,
        showSuccess: true,
        showWarning: true,
        roles: ['ROLE_BNT_UPDATE']
      },
      {
        url: "/route-bnt/history",
        method: "GET",
        label: "list_history",
        comment: "tarix jadvali bnt",
        active: true,
        showSuccess: false,
        showWarning: true,
        roles: ["ROLE_BNT_READ"]
      },
      {
        url: "/route-bnt/crud/cmdt-child",
        method: "POST",
        label: "create_cmdt_child",
        comment: "bnt o'rganilgan tovar ma'lumotini kiritish",
        active: true,
        showSuccess: true,
        showWarning: true,
        roles: []
      },
      {
        url: "/route-bnt/crud/cmdt-child",
        method: "DELETE",
        label: "delete_cmdt_child",
        comment: "bnt o'rganilgan tovar ma'lumotini o'chirish",
        active: true,
        showSuccess: true,
        showWarning: true,
        roles: []
      },
      {
        url: "/route-bnt/crud/cmdt-desc",
        method: "POST",
        label: "create_cmdt_desc",
        comment: "bnt tovar tasnif ma'lumotini kiritish",
        active: true,
        showSuccess: true,
        showWarning: true,
        roles: []
      },
      {
        url: "/route-bnt/crud",
        method: "get",
        label: "crud_read",
        comment: "bnt ma'lumoti",
        active: true,
        showSuccess: false,
        showWarning: true,
        roles: []
      },
      {
        url: "/route-bnt/crud/cmdt",
        method: "get",
        label: "cmdt_list_read",
        comment: "bnt tovar ro'yxati",
        active: true,
        showSuccess: false,
        showWarning: true,
        roles: []
      },
      {
        url: "/route-bnt/crud",
        method: "patch",
        label: "cmdt_status_update",
        comment: "bnt tovar hoatini ozgartirish",
        active: true,
        showSuccess: true,
        showWarning: true,
        roles: []
      },
      {
        url: "/route-bnt/crud/cmdt/desc",
        method: "get",
        label: "cmdt_desc_list_read",
        comment: "bnt tovar desc ro'yxati",
        active: true,
        showSuccess: false,
        showWarning: true,
        roles: []
      },
      {
        url: "/route-bnt/file",
        method: "post",
        label: "bnt_file_save",
        comment: "bnt tovar saqlash",
        active: true,
        showSuccess: true,
        showWarning: true,
        roles: []
      },
      {
        url: "/route-bnt/file",
        method: "get",
        label: "download",
        comment: "bnt tovar yuklab olish",
        active: true,
        showSuccess: true,
        showWarning: true,
        roles: []
      },
      {
        url: "/route-bnt/file/report",
        method: "get",
        label: "download_decision",
        comment: "bnt qaror pdf olish",
        active: true,
        showSuccess: true,
        showWarning: true,
        roles: []
      },

      /*todo catalog*/
      {
        url: "/route-bnt/classified/lab-status",
        method: "get",
        label: "bnt_app_cmdt_status",
        comment: "bnt app va tovar statuslari",
        active: true,
        showSuccess: false,
        showWarning: true,
        roles: []
      }
    ]
  },
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
]
