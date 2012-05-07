
$(document).ready( function() {
    document.addEventListener("deviceready", onDeviceReady, false);
    window.addEventListener("resize", orientationChange, false);
    childBrowser = ChildBrowser.install();
});

function orientationChange() {
    nativeControls = window.plugins.nativeControls;
    nativeControls.resizeTabBar();
}

function onDeviceReady() {
    newLoc = location.href.substring(0, location.href.lastIndexOf("/")+1);
    
    // Initializating TabBar
    nativeControls = window.plugins.nativeControls;
    nativeControls.createTabBar();

    // Back Button
  nativeControls.createTabBarItem(
    "page1",
    "Page 1",
    "www/images/pound.png",
    {"onSelect": function() {
        $.mobile.changePage( "#page1", { transition: 'reverse slide' } );
        nativeControls.setNavBarTitle("Page 1");
        nativeControls.selectTabBarItem("page1");
        selectedTabBarItem = "page1";
    }}
  );
  
  // Home tab
  nativeControls.createTabBarItem(
    "page2",
    "Page 2",
    "www/images/pound.png",
    {"onSelect": function() {
        if ( selectedTabBarItem == "page1" ) {
            $.mobile.changePage( "#page2", { transition: 'slide' } );
        } else {
            $.mobile.changePage( "#page2", { transition: 'reverse slide' } );        
        }        
        nativeControls.setNavBarTitle("Page 2");
        nativeControls.selectTabBarItem("page2");
        selectedTabBarItem = "page2";
    }}
  );
  
  // About tab
  nativeControls.createTabBarItem(
    "page3",
    "Page 3",
    "www/images/question.png",
    {"onSelect": function() {
        $.mobile.changePage( "#page3", { transition: 'slide' } );
        nativeControls.setNavBarTitle("Page 3");
        nativeControls.selectTabBarItem("page3");
        selectedTabBarItem = "page3";
    }}
  );
    // Compile the TabBar
    nativeControls.showTabBar();
    nativeControls.showTabBarItems("page1", "page2", "page3");

    selectedTabBarItem = "page1";
    nativeControls.selectTabBarItem("page1");

    // Setup NavBar
    nativeControls.createNavBar();
    nativeControls.setNavBarTitle("Page 1");
    
    nativeControls.setupLeftNavButton(
        "?",
        "",
        "onLeftNavButton"
    );
    
    //nativeControls.hideLeftNavButton();

    nativeControls.setupRightNavButton(
        "About",
        "",
        "onRightNavButton"
    );

    nativeControls.showNavBar();
}

function onLeftNavButton() {
    alert('zSprawl Rocks!');
}

function onRightNavButton() {
    childBrowser.showWebPage( "http://zsprawl.com/about/index.html");
}