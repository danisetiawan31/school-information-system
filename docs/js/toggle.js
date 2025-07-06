// Toggle sidebar functionality - VERSI RESPONSIVE DIPERBAIKI
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
    let isScrolling = false;

    // Fungsi untuk reset semua classes dan styles
    function resetSidebarStates() {
        sidebar.classList.remove('collapsed', 'mobile-open');
        overlay.classList.remove('show');
        // Reset inline styles jika ada
        sidebar.style.transform = '';
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
            sessionStorage.setItem('sidebarCollapsed', 'false');
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

    // Prevent sidebar close on sidebar click
    sidebar.addEventListener('click', function (e) {
        e.stopPropagation();
    });

    // Handle touch events untuk mencegah sidebar tertutup saat scroll
    sidebar.addEventListener('touchstart', function (e) {
        touchStartY = e.touches[0].clientY;
        isScrolling = false;
    }, { passive: true });

    sidebar.addEventListener('touchmove', function (e) {
        if (!touchStartY) return;
        
        const touchY = e.touches[0].clientY;
        const diffY = Math.abs(touchY - touchStartY);
        
        if (diffY > 5) {
            isScrolling = true;
        }
    }, { passive: true });

    sidebar.addEventListener('touchend', function (e) {
        touchStartY = 0;
        setTimeout(() => {
            isScrolling = false;
        }, 100);
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

    // Prevent document click from closing sidebar when it's locked
    document.addEventListener('click', function (e) {
        if (window.innerWidth <= 768 && isSidebarOpen()) {
            // Jika click di luar sidebar dan overlay, tutup sidebar
            if (!sidebar.contains(e.target) && !overlay.contains(e.target) && !toggleBtn.contains(e.target)) {
                closeSidebar();
            }
        }
    });

    // Prevent scroll events from closing sidebar
    let scrollTimeout;
    window.addEventListener('scroll', function () {
        if (sidebarLocked || isScrolling) return;
        
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            // Jangan tutup sidebar saat scroll
        }, 150);
    }, { passive: true });

    // Handle escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && isSidebarOpen() && window.innerWidth <= 768) {
            closeSidebar();
        }
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
    console.log('Sidebar classes:', sidebar.className);
    console.log('Main content classes:', mainContent.className);
    console.log('Overlay classes:', overlay.className);
    console.log('Sidebar computed transform:', window.getComputedStyle(sidebar).transform);
    console.log('Body overflow:', document.body.style.overflow);
}