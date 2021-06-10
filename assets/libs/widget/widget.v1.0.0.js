const sandBoxbaseUrl = "http://localhost:4200";
const sandBox = `${sandBoxbaseUrl}`;
// const sandBoxbaseUrl = "https://xmalmorthen.github.io";
// const sandBox = `${sandBoxbaseUrl}/xmalSign`;
const widgetId = 'xmalSignWidget';

(async ($scope) => {

    $scope.xmalSign = $scope.xmalSign || [];
    $scope.xmalSign.widget = $scope.xmalSign.widget || [];

    if (!$scope.xmalSign)
        return false;
    
    const insertCSS = () => {
        
        return new Promise( (res) => {

            const cssDOM = document.getElementsByTagName("head")[0];
            const csssToLoad = [
                {id: 'xmalSign_fa', src: 'https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css'}
            ];
            let scrLoaded = 0;
            
            csssToLoad.forEach(data => {

                const css = document.createElement("link");
                css.id = data.id;
                css.rel = 'stylesheet';
                css.type = "text/css";
                css.href = data.src;
                css.media = 'all'
                //css.async = false;
                css.onload = (evt) => {
                    scrLoaded++;
                    if (scrLoaded == csssToLoad.length)
                        res(true);
                };
                css.onerror = (err) => {
                    scrLoaded++;
                    if (scrLoaded == csssToLoad.length)
                        res(true);
                };
                
                cssDOM.appendChild(css);

            });

        });

        
    }
    
    const insertScripts = () => {
        
        return new Promise( (res) => {

            const scriptDOM = document.getElementsByTagName("script")[0];
            const scriptsToLoad = [
                {id: 'xmalSign_jq', src: 'https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js'},
                {id: 'xmalSign_lo', src:'https://cdn.jsdelivr.net/npm/gasparesganga-jquery-loading-overlay@2.1.7/dist/loadingoverlay.min.js'}
            ];
            let scrLoaded = 0;
            
            scriptsToLoad.forEach(data => {
                const script = document.createElement("script");
                script.type = "text/javascript";
                script.id = data.id;
                //script.async = false;
                script.src = data.src;
                script.onload = (evt) => {
                    scrLoaded++;
                    if (scrLoaded == scriptsToLoad.length)
                        res(true);
                }
                script.onerror = (err) => {
                    scrLoaded++;
                    if (scrLoaded == scriptsToLoad.length)
                        res(true);
                }
                scriptDOM.parentNode.insertBefore(script, scriptDOM);
            });

        });

        
    }

    const prepareFrame = (config) => {
        const ifrm = document.createElement("iframe");

        const cnfgs = btoa(config.configurations ? JSON.stringify(config.configurations) : config.configurations);

        ifrm.onload = function(){
            sendMsg("{status: 1, message: 'frame loaded'}"); 
            loading(false, config.frame?.loading?.container);
        }
        ifrm.onerror= function(){
            sendMsg("{status: 0, message: 'frame not loaded'}"); 
            loading(false, config.frame?.loading?.container);
        }
        ifrm.id = $scope.xmalSign.config.widgetId;
        ifrm.setAttribute("src", `${$scope.xmalSign.config.sandBox}/#?wId=${ btoa(config?.signToken) }&lo=${ btoa($scope.location.origin) }&cnfg=${cnfgs}`);
        ifrm.style.width = config.frame?.width || "100%";
        ifrm.style.height = config.frame?.height || "100vh";
        ifrm.style.border = config.frame?.border || "none";
        ifrm.style.padding = config.frame?.padding || "1rem";

        return ifrm;
    }

    const loading = (evt, target)  =>{
        try {
            const jq = jQuery ? jQuery.noConflict() : null;
            const loConfig = {
                image                   : "",
                background              : "rgba(0, 0, 0, .5)",
                fontawesome             : "fa fa-gear fa-spin",
                fontawesomeAnimation    : "0.7s fade",
                fontawesomeAutoResize   : false,
                fontawesomeResizeFactor : 2,
                fontawesomeColor        : "#ffcc00",
            };

            const jqTarget = target ? ( target.trim().toLowerCase() !== 'widget' ? jq(target) : jq(`#${$scope.xmalSign.config.widgetId}`) ): jq;

            if (evt)
                jqTarget.LoadingOverlay("show",loConfig);
            else
                jqTarget.LoadingOverlay("hide", true);

        } catch (err) {}
    }

    $scope.xmalSign.config = {sandBoxbaseUrl,sandBox,widgetId, origin: $scope.location.origin};

    await insertCSS();
    await insertScripts();
    
    $scope.xmalSign.widget = (params) =>{
        
        const { appendTo } = params;
        
        if(!appendTo) 
        alert('Debe especificar el contenedor del widget');
        
        if (params.frame?.loading?.show) {
            loading(true, params.frame?.loading?.container);
        }

        const eleAppendTo = document.getElementById(appendTo);
        eleAppendTo.appendChild(prepareFrame(params));

        $scope.xmalSign.config.ifrm = document.getElementById($scope.xmalSign.config.widgetId);

        //$scope.xmalSign.config.ifrm.contentWindow.postMessage(JSON.stringify({}), '*');
    };

    sendMsg = (data) => {
        
        let dataModel;
        if (typeof(data) !== "string")
            dataModel = JSON.stringify(data);
        else
            dataModel = data;
            
        $scope.xmalSign.config.ifrm.contentWindow.postMessage(dataModel,$scope.xmalSign.config.sandBoxbaseUrl);        
    }

    // $scope.addEventListener("message", function(evt) {
    //     debugger;
    //     if (evt.origin === $scope.xmalSign.config.sandBox && evt.data) {
    //         console.debug('message from', evt.origin, evt);            
    //     }
    // }, false);

})(window);