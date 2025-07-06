// Toggle sidebar functionality - VERSI RESPONSIVE DIPERBAIKI LENGKAP
document.addEventListener('DOMContentLoaded', function () {
    const toggleBtn = document.getElementById('toggle-sidebar');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');
    const overlay = document.getElementById('overlay');

    // Cek apakah semua element ada
    if (!toggleBtn || !sidebar || !mainContent || !overlay) {
        console.error('Beberapa element tidak ditemukan:', {
            toggleBtn: !!toggleBtn,
            sidebar: !!sidebar,
            mainContent: !!mainContent,
            overlay: !!overlay
        });
        return;
    }

    // Variable untuk melacak status sidebar
    let sidebarLocked = false;
    let touchStartY = 0;
    let touchStartX = 0;
    let isScrolling = false;
    let isTouching = false;

    // Fungsi untuk reset semua classes dan styles
    function resetSidebarStates() {
        sidebar.classList.remove('collapsed', 'mobile-open');
        overlay.classList.remove('show');
        // Reset inline styles jika ada
        sidebar.style.transform = '';
        document.body.style.overflow = '';
    }

    // Fungsi untuk setup desktop layout
    function setupDesktopLayout() {
        resetSidebarStates();
        // Di desktop, sidebar default terbuka dan main content menyesuaikan
        mainContent.classList.remove('expanded');
        sidebar.classList.remove('collapsed');
        sidebarLocked = false;
    }

    // Fungsi untuk setup mobile layout
    function setupMobileLayout() {
        resetSidebarStates();
        // Di mobile, sidebar default tertutup
        sidebar.classList.add('collapsed');
        mainContent.classList.add('expanded');
        sidebarLocked = false;
    }

    // Fungsi untuk membuka sidebar
    function openSidebar() {
        if (window.innerWidth <= 768) {
            // Mobile: gunakan mobile-open class
            sidebar.classList.remove('collapsed');
            sidebar.classList.add('mobile-open');
            overlay.classList.add('show');
            sidebarLocked = true; // Lock sidebar saat terbuka di mobile
            // Prevent body scroll when sidebar is open
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
            document.body.style.height = '100%';
        } else {
            // Desktop: hilangkan collapsed class
            sidebar.classList.remove('collapsed');
            mainContent.classList.remove('expanded');
            sidebarLocked = false;
        }
    }

    // Fungsi untuk menutup sidebar
    function closeSidebar() {
        if (window.innerWidth <= 768) {
            // Mobile: tutup dan hilangkan overlay
            sidebar.classList.add('collapsed');
            sidebar.classList.remove('mobile-open');
            overlay.classList.remove('show');
            sidebarLocked = false;
            // Restore body scroll
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
            document.body.style.height = '';
        } else {
            // Desktop: collapse sidebar dan expand main content
            sidebar.classList.add('collapsed');
            mainContent.classList.add('expanded');
            sidebarLocked = false;
        }
    }

    // Fungsi untuk cek status sidebar (terbuka/tertutup)
    function isSidebarOpen() {
        if (window.innerWidth <= 768) {
            return sidebar.classList.contains('mobile-open');
        } else {
            return !sidebar.classList.contains('collapsed');
        }
    }

    // Fungsi untuk handle responsive behavior
    function handleResponsiveLayout() {
        const currentWidth = window.innerWidth;
        
        if (currentWidth <= 768) {
            // Switching to mobile
            setupMobileLayout();
        } else {
            // Switching to desktop
            setupDesktopLayout();
            // Restore body scroll when switching to desktop
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
            document.body.style.height = '';
        }
        
        console.log(`Layout switched to: ${currentWidth <= 768 ? 'Mobile' : 'Desktop'} (${currentWidth}px)`);
    }

    // Toggle sidebar - LOGIKA UTAMA
    toggleBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('Toggle clicked, window width:', window.innerWidth);
        console.log('Sidebar open status:', isSidebarOpen());
        
        if (isSidebarOpen()) {
            closeSidebar();
            console.log('Sidebar ditutup');
        } else {
            openSidebar();
            console.log('Sidebar dibuka');
        }
    });

    // Tutup sidebar saat mengklik overlay (hanya di mobile)
    overlay.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Overlay clicked - closing sidebar');
        closeSidebar();
    });

    // Prevent sidebar close on sidebar click/touch
    sidebar.addEventListener('click', function (e) {
        e.stopPropagation();
    });

    // Handle touch events untuk mencegah sidebar tertutup saat scroll
    sidebar.addEventListener('touchstart', function (e) {
        touchStartY = e.touches[0].clientY;
        touchStartX = e.touches[0].clientX;
        isScrolling = false;
        isTouching = true;
        e.stopPropagation();
    }, { passive: true });

    sidebar.addEventListener('touchmove', function (e) {
        if (!touchStartY || !isTouching) return;
        
        const touchY = e.touches[0].clientY;
        const touchX = e.touches[0].clientX;
        const diffY = Math.abs(touchY - touchStartY);
        const diffX = Math.abs(touchX - touchStartX);
        
        // Jika gerakan lebih vertikal (scroll), tandai sebagai scrolling
        if (diffY > 10 && diffY > diffX) {
            isScrolling = true;
        }
        
        e.stopPropagation();
    }, { passive: true });

    sidebar.addEventListener('touchend', function (e) {
        touchStartY = 0;
        touchStartX = 0;
        isTouching = false;
        
        // Reset isScrolling setelah delay
        setTimeout(() => {
            isScrolling = false;
        }, 200);
        
        e.stopPropagation();
    }, { passive: true });

    // Prevent scroll pada sidebar dari mempengaruhi document
    sidebar.addEventListener('scroll', function (e) {
        e.stopPropagation();
    }, { passive: true });

    // Handle window resize - PERBAIKAN UTAMA
    let resizeTimeout;
    window.addEventListener('resize', function () {
        // Debounce resize event untuk performa
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            handleResponsiveLayout();
        }, 100);
    });

    // Handle click outside sidebar untuk mobile
    document.addEventListener('click', function (e) {
        // Hanya jalankan jika di mobile dan sidebar terbuka
        if (window.innerWidth <= 768 && isSidebarOpen()) {
            // Jika click di luar sidebar dan bukan di toggle button
            if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
                // Pastikan tidak sedang scrolling
                if (!isScrolling && !isTouching) {
                    closeSidebar();
                }
            }
        }
    });

    // Handle touch outside sidebar untuk mobile
    document.addEventListener('touchstart', function (e) {
        // Hanya jalankan jika di mobile dan sidebar terbuka
        if (window.innerWidth <= 768 && isSidebarOpen()) {
            // Jika touch di luar sidebar dan bukan di toggle button
            if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
                // Pastikan tidak sedang scrolling
                if (!isScrolling && !isTouching) {
                    closeSidebar();
                }
            }
        }
    }, { passive: true });

    // HAPUS event listener scroll yang menyebabkan sidebar tertutup
    // Jangan tambahkan window scroll listener yang menutup sidebar

    // Handle escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && isSidebarOpen() && window.innerWidth <= 768) {
            closeSidebar();
        }
    });

    // Prevent default touch behaviors yang bisa mengganggu
    sidebar.addEventListener('touchstart', function(e) {
        e.stopPropagation();
    }, { passive: true });

    sidebar.addEventListener('touchmove', function(e) {
        e.stopPropagation();
    }, { passive: true });

    sidebar.addEventListener('touchend', function(e) {
        e.stopPropagation();
    }, { passive: true });

    // Handle orientationchange untuk mobile
    window.addEventListener('orientationchange', function() {
        setTimeout(() => {
            handleResponsiveLayout();
        }, 200);
    });

    // Initialize layout berdasarkan ukuran window saat ini
    handleResponsiveLayout();

    // Set tanggal hari ini sebagai default (jika fungsi ada)
    if (typeof setCurrentDate === 'function') {
        setCurrentDate();
    }

    console.log('Responsive sidebar initialized successfully');
});

// Fungsi tambahan untuk debugging
function debugSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');
    const overlay = document.getElementById('overlay');
    
    console.log('=== SIDEBAR DEBUG INFO ===');
    console.log('Window width:', window.innerWidth);
    console.log('Device type:', window.innerWidth <= 768 ? 'Mobile' : 'Desktop');
    console.log('Sidebar classes:', sidebar ? sidebar.className : 'null');
    console.log('Main content classes:', mainContent ? mainContent.className : 'null');
    console.log('Overlay classes:', overlay ? overlay.className : 'null');
    console.log('Body overflow:', document.body.style.overflow);
    console.log('Body position:', document.body.style.position);
    
    if (sidebar) {
        console.log('Sidebar computed transform:', window.getComputedStyle(sidebar).transform);
        console.log('Sidebar height:', sidebar.offsetHeight);
        console.log('Sidebar scroll height:', sidebar.scrollHeight);
    }
}

// Fungsi untuk force close sidebar (untuk debugging)
function forceCloseSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    
    if (sidebar) {
        sidebar.classList.add('collapsed');
        sidebar.classList.remove('mobile-open');
    }
    
    if (overlay) {
        overlay.classList.remove('show');
    }
    
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.height = '';
    
    console.log('Sidebar force closed');
}

// Fungsi untuk force open sidebar (untuk debugging)
function forceOpenSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    
    if (window.innerWidth <= 768) {
        if (sidebar) {
            sidebar.classList.remove('collapsed');
            sidebar.classList.add('mobile-open');
        }
        
        if (overlay) {
            overlay.classList.add('show');
        }
        
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.height = '100%';
    }
    
    console.log('Sidebar force opened');
}