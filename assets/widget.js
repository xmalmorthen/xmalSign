const sandBox = "https://xmalmorthen.github.io/xmalSign";
const widgetId = 'xmalSignWidget';

function prepareFrame(size) {
    var ifrm = document.createElement("iframe");
    ifrm.id = widgetId;
    ifrm.setAttribute("src", sandBox);
    ifrm.style.width = size?.width || "100%";
    ifrm.style.height = size?.height || "100vh";
    return ifrm;
}


(($scope) => {

    $scope.xmalSign = $scope.xmalSign || [];
    $scope.xmalSign.widget = $scope.xmalSign.widget || [];

    if (!$scope.xmalSign.widget)
        return false;

    window.xmalSign = {
        widget: function(params) {
            console.log(params);

            const { appendTo, size } = params;

            if(!appendTo) 
                alert('Debe especificar el contenedor del widget');

            const eleAppendTo = document.getElementById(appendTo);
            eleAppendTo.appendChild(prepareFrame(size));
                        
            const ifrm = document.getElementById(widgetId);
            const src = ifrm.src.match(/^.+\:\/\/[^\/]+/)[0];

            //window.parent.postMessage(JSON.stringify({id:1}),'*');

        }
    }

    window.addEventListener("message", function(evt) {
        const ifrm = document.getElementById(widgetId);
        const src = ifrm.src.match(/^.+\:\/\/[^\/]+/)[0];

        if (evt.origin === sandBox && evt.data) {
            ifrm.contentWindow.postMessage(evt.data,src);
        }
    }, false)

})(window);