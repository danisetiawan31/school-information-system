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
    let preventClose = false;

    // Fungsi untuk reset semua classes dan styles
    function resetSidebarStates() {
        sidebar.classList.remove('collapsed', 'mobile-open');
        overlay.classList.remove('show');
        // Reset inline styles jika ada
        sidebar.style.transform = '';
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.height = '';
    }

    // Fungsi untuk setup desktop layout
    function setupDesktopLayout() {
        resetSidebarStates();
        // Di desktop, sidebar default terbuka dan main content menyesuaikan
        mainContent.classList.remove('expanded');
        sidebar.classList.remove('collapsed');
        sidebarLocked = false;
        preventClose = false;
    }

    // Fungsi untuk setup mobile layout
    function setupMobileLayout() {
        resetSidebarStates();
        // Di mobile, sidebar default tertutup
        sidebar.classList.add('collapsed');
        mainContent.classList.add('expanded');
        sidebarLocked = false;
        preventClose = false;
    }

    // Fungsi untuk membuka sidebar
    function openSidebar() {
        if (window.innerWidth <= 768) {
            // Mobile: gunakan mobile-open class
            sidebar.classList.remove('collapsed');
            sidebar.classList.add('mobile-open');
            overlay.classList.add('show');
            sidebarLocked = true;
            preventClose = true;
            
            // Prevent body scroll when sidebar is open - PERBAIKAN UTAMA
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
            document.body.style.height = '100%';
            document.body.style.top = '0';
            document.body.style.left = '0';
            
            // Pastikan sidebar full height dan scrollable
            sidebar.style.height = '100vh';
            sidebar.style.overflowY = 'auto';
            sidebar.style.position = 'fixed';
            sidebar.style.top = '0';
            sidebar.style.left = '0';
            sidebar.style.zIndex = '1000';
            
        } else {
            // Desktop: hilangkan collapsed class
            sidebar.classList.remove('collapsed');
            mainContent.classList.remove('expanded');
            sidebarLocked = false;
            preventClose = false;
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
            preventClose = false;
            
            // Restore body scroll
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
            document.body.style.height = '';
            document.body.style.top = '';
            document.body.style.left = '';
            
            // Reset sidebar styles
            sidebar.style.height = '';
            sidebar.style.overflowY = '';
            sidebar.style.position = '';
            sidebar.style.top = '';
            sidebar.style.left = '';
            sidebar.style.zIndex = '';
            
        } else {
            // Desktop: collapse sidebar dan expand main content
            sidebar.classList.add('collapsed');
            mainContent.classList.add('expanded');
            sidebarLocked = false;
            preventClose = false;
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

    // Prevent sidebar close pada semua events di dalam sidebar
    sidebar.addEventListener('click', function (e) {
        e.stopPropagation();
        preventClose = true;
        setTimeout(() => {
            preventClose = false;
        }, 100);
    });

    // Prevent semua touch events di sidebar dari mempengaruhi document
    sidebar.addEventListener('touchstart', function (e) {
        e.stopPropagation();
        preventClose = true;
    }, { passive: true });

    sidebar.addEventListener('touchmove', function (e) {
        e.stopPropagation();
        preventClose = true;
    }, { passive: true });

    sidebar.addEventListener('touchend', function (e) {
        e.stopPropagation();
        setTimeout(() => {
            preventClose = false;
        }, 200);
    }, { passive: true });

    // Prevent scroll events di sidebar
    sidebar.addEventListener('scroll', function (e) {
        e.stopPropagation();
        preventClose = true;
        setTimeout(() => {
            preventClose = false;
        }, 100);
    }, { passive: true });

    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            handleResponsiveLayout();
        }, 100);
    });

    // Handle click outside sidebar - HANYA untuk area yang bukan sidebar
    document.addEventListener('click', function (e) {
        if (window.innerWidth <= 768 && isSidebarOpen() && !preventClose) {
            if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
                closeSidebar();
            }
        }
    });

    // Handle escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && isSidebarOpen() && window.innerWidth <= 768) {
            closeSidebar();
        }
    });

    // HAPUS SEMUA EVENT LISTENER SCROLL YANG BISA MENUTUP SIDEBAR
    // Tidak ada window scroll listener yang menutup sidebar

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
    console.log('Window height:', window.innerHeight);
    console.log('Device type:', window.innerWidth <= 768 ? 'Mobile' : 'Desktop');
    console.log('Sidebar classes:', sidebar ? sidebar.className : 'null');
    console.log('Main content classes:', mainContent ? mainContent.className : 'null');
    console.log('Overlay classes:', overlay ? overlay.className : 'null');
    console.log('Body overflow:', document.body.style.overflow);
    console.log('Body position:', document.body.style.position);
    
    if (sidebar) {
        console.log('Sidebar height:', sidebar.offsetHeight);
        console.log('Sidebar scroll height:', sidebar.scrollHeight);
        console.log('Sidebar style height:', sidebar.style.height);
        console.log('Sidebar computed transform:', window.getComputedStyle(sidebar).transform);
    }
}

// Fungsi untuk memaksa sidebar tetap terbuka (untuk debugging)
function lockSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    
    if (window.innerWidth <= 768) {
        if (sidebar) {
            sidebar.classList.remove('collapsed');
            sidebar.classList.add('mobile-open');
            sidebar.style.height = '100vh';
            sidebar.style.position = 'fixed';
            sidebar.style.top = '0';
            sidebar.style.left = '0';
            sidebar.style.zIndex = '1000';
            sidebar.style.overflowY = 'auto';
        }
        
        if (overlay) {
            overlay.classList.add('show');
        }
        
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.height = '100%';
    }
    
    console.log('Sidebar locked open');
}