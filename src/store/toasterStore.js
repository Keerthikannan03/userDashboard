import { defineStore } from "pinia";

const toasterStore = defineStore("toasterStore", {
  state: () => ({
    toasterStatus: false,
    toasterMsg: "",
    toasterType: "success",
    toasterColor: "success",
    duration: "success",
    type: "",
    position: "",
    toastIcon:"",
  }),
  getters: {},
  actions: {
    manageStore(res, type) {
        new Promise((resolve)=>{
            let method = { post: "Added", delete: "Deleted", put: "Updated" }[res.config.method] || "";
            let sample = { post: "Destroy"}['post'] || "";
            console.log(sample, "headersheadersheaders");
            if (res?.status === 200 || res?.status === 201 || res?.statusText === "OK") {
              this.toasterAction({
                toasterStatus: true,
                message: `${type} ${method} Successfully`,
                fortype: type,
                color: "success",
                icon: "mdi-check-bold",
            });
        } else {
            this.toasterAction({
                toasterStatus: true,
                message: 'Something went wrong',
                color: "danger",
                fortype: type,
                icon: "mdi-close-thick",
              });
            }
            resolve('complate');
        })
    },
    toasterAction(toastdetails) {
        new Promise((resolve)=>{
            let defaultOptions = {
              duration: 2000,
              location: "top center",
            };
      
            const options = { ...defaultOptions, ...toastdetails };
      
            this.toasterStatus = options.toasterStatus;
            this.toasterMsg = options.message;
            this.toasterColor = options.color;
            this.toasterType = options.fortype;
            this.duration = options.duration;
            this.position = options.location;
            this.toastIcon = options.icon;

                        
            console.log(this.toasterStatus,this.toasterMsg,this.toasterColor,this.toasterType,this.duration,this.toastIcon,"options-----");
            resolve('complate');
        })
    },
  },
});

export default toasterStore;
