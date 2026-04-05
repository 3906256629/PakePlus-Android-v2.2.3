(function() {
    function handleImageError(img) {
        if (img.getAttribute('data-error-handled') === 'true') return;
        img.setAttribute('data-error-handled', 'true');
        img.style.opacity = '0';
        var parent = img.parentElement;
        if (parent) {
            parent.style.background = '#eef2f6';
            parent.style.borderRadius = '50%';
        }
    }
    var img = document.querySelector('.logo-icon-large img');
    if (img) {
        if (img.complete && img.naturalWidth === 0) {
            handleImageError(img);
        }
        img.addEventListener('error', function() {
            handleImageError(img);
        });
    }
})();