import { lazy, Suspense } from 'react';
import { useAppState } from './hooks/useAppState';
import BottomTabBar from './components/BottomTabBar';
import ZuriChat from './components/ZuriChat';
import AuthScreen from './screens/AuthScreen';
import HomeScreen from './screens/HomeScreen';
import type { Property, Screen } from './types';

const PropertyDetailScreen = lazy(() => import('./screens/PropertyDetailScreen'));
const MapScreen = lazy(() => import('./screens/MapScreen'));
const FiltersScreen = lazy(() => import('./screens/FiltersScreen'));
const FavoritesScreen = lazy(() => import('./screens/FavoritesScreen'));
const MessagesScreen = lazy(() => import('./screens/MessagesScreen'));
const NotificationsScreen = lazy(() => import('./screens/NotificationsScreen'));
const PaymentScreen = lazy(() => import('./screens/PaymentScreen'));
const DocumentsScreen = lazy(() => import('./screens/DocumentsScreen'));
const ScheduleVisitScreen = lazy(() => import('./screens/ScheduleVisitScreen'));
const LandlordDashboardScreen = lazy(() => import('./screens/LandlordDashboardScreen'));
const PostListingScreen = lazy(() => import('./screens/PostListingScreen'));
const ProfileScreen = lazy(() => import('./screens/ProfileScreen'));

function ScreenSkeleton() {
  return (
    <div style={{ flex: 1, padding: 16, background: '#0d0d1a' }}>
      {[1, 2, 3].map(i => (
        <div key={i} className="skeleton" style={{ height: 200, borderRadius: 16, marginBottom: 16 }} />
      ))}
    </div>
  );
}

export default function App() {
  const app = useAppState();

  if (!app.isAuthenticated) {
    return (
      <div className="app-shell">
        <AuthScreen onLogin={(role: 'locataire' | 'propriétaire') => app.setAuthenticated(role)} />
      </div>
    );
  }

  const hideTabBar = ['filters', 'map', 'property-detail', 'schedule-visit', 'post-listing', 'chat'].includes(app.screen);
  const nav = (screen: string, property?: Property) => app.navigate(screen as Screen, property);
  const userRole = app.currentUser.role === 'admin' ? 'propriétaire' as const : app.currentUser.role;

  const renderScreen = () => {
    switch (app.screen) {
      case 'home':
        return (
          <HomeScreen
            onPropertySelect={(p: Property) => app.navigate('property-detail', p)}
            onNavigate={nav}
            favorites={app.favorites}
            onToggleFavorite={(id: string) => app.toggleFavorite(id)}
            filters={app.filters}
            searchQuery={app.searchQuery}
            onSearchChange={app.setSearchQuery}
            unreadNotifications={app.unreadNotifications}
            userRole={userRole}
          />
        );

      case 'property-detail':
        if (!app.selectedProperty) { app.navigate('home'); return null; }
        return (
          <PropertyDetailScreen
            property={app.selectedProperty}
            isFavorite={app.favorites.includes(app.selectedProperty.id)}
            onToggleFavorite={() => app.toggleFavorite(app.selectedProperty!.id)}
            onBack={app.goBack}
            onNavigate={(screen: string) => app.navigate(screen as Screen)}
          />
        );

      case 'map':
        return (
          <MapScreen
            onBack={app.goBack}
            onPropertySelect={(p: Property) => app.navigate('property-detail', p)}
          />
        );

      case 'filters':
        return (
          <FiltersScreen
            filters={app.filters}
            onApply={app.setFilters}
            onBack={app.goBack}
          />
        );

      case 'favorites':
        return (
          <FavoritesScreen
            favorites={app.favorites}
            onToggleFavorite={app.toggleFavorite}
            onPropertySelect={(p: Property) => app.navigate('property-detail', p)}
            compareList={app.compareList}
            onToggleCompare={app.toggleCompare}
            onNavigate={(screen: string) => app.navigate(screen as Screen)}
          />
        );

      case 'messages':
      case 'chat':
        return (
          <MessagesScreen
            onBack={app.goBack}
            selectedConversationId={app.selectedConversationId}
            onMarkRead={app.markMessagesRead}
          />
        );

      case 'notifications':
        return (
          <NotificationsScreen
            onBack={app.goBack}
            onMarkRead={app.markNotificationsRead}
            onNavigate={(screen: string) => app.navigate(screen as Screen)}
          />
        );

      case 'payment':
        return <PaymentScreen onBack={app.goBack} />;

      case 'documents':
        return <DocumentsScreen onBack={app.goBack} />;

      case 'schedule-visit':
        return (
          <ScheduleVisitScreen
            onBack={app.goBack}
            propertyTitle={app.selectedProperty?.title}
          />
        );

      case 'landlord-dashboard':
        return (
          <LandlordDashboardScreen
            onNavigate={(screen: Screen, property?: Property) => app.navigate(screen, property)}
          />
        );

      case 'post-listing':
        return <PostListingScreen onBack={app.goBack} />;

      case 'profile':
        return (
          <ProfileScreen
            onNavigate={(screen: Screen) => app.navigate(screen)}
            onLogout={app.logout}
          />
        );

      default:
        return (
          <HomeScreen
            onPropertySelect={(p: Property) => app.navigate('property-detail', p)}
            onNavigate={nav}
            favorites={app.favorites}
            onToggleFavorite={(id: string) => app.toggleFavorite(id)}
            filters={app.filters}
            searchQuery={app.searchQuery}
            onSearchChange={app.setSearchQuery}
            unreadNotifications={app.unreadNotifications}
            userRole={userRole}
          />
        );
    }
  };

  return (
    <div className="app-shell">
      <Suspense fallback={<ScreenSkeleton />}>
        {renderScreen()}
      </Suspense>
      {!hideTabBar && (
        <BottomTabBar
          current={app.screen}
          onNavigate={(screen: Screen) => app.navigate(screen)}
          unreadMessages={app.unreadMessages}
          unreadNotifications={app.unreadNotifications}
          userRole={userRole}
        />
      )}
      <ZuriChat />
    </div>
  );
}
