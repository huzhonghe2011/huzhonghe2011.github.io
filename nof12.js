document.addEventListener('DOMContentLoaded', function() {

    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'F12') {
            e.preventDefault();
            return false;
        }

        if (e.ctrlKey && e.shiftKey && e.key === 'I') {
            e.preventDefault();
            return false;
        }

        if (e.ctrlKey && e.key === 'u') {
            e.preventDefault();
            return false;
        }

        if (e.ctrlKey && e.shiftKey && e.key === 'J') {
            e.preventDefault();
            return false;
        }

        if (e.ctrlKey && e.shiftKey && e.key === 'C') {
            e.preventDefault();
            return false;
        }
    });
  
    function disableViewSourceMenu() {
        document.onkeypress = function(e) {
            if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
                return false;
            }
        };
        
        if (typeof document.documentElement.oncontextmenu === 'undefined') {
            document.documentElement.oncontextmenu = function() {
                return false;
            };
        }
    }
    disableViewSourceMenu();
});
