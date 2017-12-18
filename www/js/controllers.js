app.controller('cameraPreviewCtrl', ['$scope', '$document', 'photoService', function($scope, $document, photoService) {
    // Initialize Camera Preview
    var options = {
        x: 0,
        y: 0,
        width: window.screen.width,
        height: window.screen.height,
        camera: CameraPreview.CAMERA_DIRECTION.BACK,  // Front/back camera
        toBack: true,   // Set to true if you want your html in front of your preview
        tapPhoto: false,  // Tap to take photo
        tapFocus: true,   // Tap to focus
        previewDrag: false
    };
    // For more options
    // Take a look at docs: https://github.com/cordova-plugin-camera-preview/cordova-plugin-camera-preview#methods
    CameraPreview.startCamera(options);

    // Initialize spinner state & flash mode
    $scope.show_spinner = false;
    $scope.flash_mode = CameraPreview.FLASH_MODE.OFF;

    // Absolute paths to icons
    $scope.flash_on_icon = 'img/icons/flash_on.svg';
    $scope.flash_off_icon = 'img/icons/flash_off.svg';
    $scope.take_pic_icon = 'img/icons/btn_icon6.png';

    // Cropped image placeholder
    $scope.cropped_photo = null;

    // Rectangle element reference
    var rect = $document[0].getElementsByClassName('rectangle')[0];

    $scope.takePicture = function() {
        // SHOW loading spinner
        $scope.show_spinner = true;
        // Get rectangle size
        var rect_width = rect.offsetWidth, rect_height = rect.offsetHeight;

        // Get rectangle coordinates
        var rect_coords = rect.getBoundingClientRect();
        var x_coord = rect_coords.left, y_coord = rect_coords.top;

        CameraPreview.takePicture(function(base64_img) {

            photoService.crop(base64_img, rect_width, rect_height, x_coord, y_coord).then(
                // Photo was successfully cropped
                function successCallback(cropped_base64_img) {

                    $scope.cropped_photo = cropped_base64_img;
                    // Photo was successfully sent to server
                    photoService.send(cropped_base64_img).then(
                        function successCallback(response) {
                            // Hide spinner
                            $scope.show_spinner = false;
                            // Reset photo placeholder
                            $scope.cropped_photo = null;
                        },
                        function errorCallback(error) {
                            // Show this message when an error occurs
                            var error_message = 'Oops, something went wrong!';
                            // Hide spinner
                            $scope.show_spinner = false;
                            // Reset photo placeholder
                            $scope.cropped_photo = null;
                            // Show error popup
                            alert(error_message);
                        }
                    );
                },
                function errorCallback(error) {
                    // Show this message when an error occurs
                    var error_message = 'Could not perform cropping action!';
                    // Hide spinner
                    $scope.show_spinner = false;
                    // Reset photo placeholder
                    $scope.cropped_photo = null;
                    // Show error popup
                    alert(error_message);
                }
            );
        });
    };

    $scope.changeFlashMode = function() {
        // Trigger flash mode
        if ($scope.flash_mode === CameraPreview.FLASH_MODE.OFF) {
            $scope.flash_mode = CameraPreview.FLASH_MODE.ON;
        } else {
            $scope.flash_mode = CameraPreview.FLASH_MODE.OFF;
        }
        // Set flash mode
        CameraPreview.setFlashMode($scope.flash_mode);
    };
}])
