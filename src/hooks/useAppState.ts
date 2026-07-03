import { useState, useCallback } from 'react';
import type { Screen, Property, FilterState, User } from '../types';
import { mockUsers, defaultFilters } from '../data/mock';

export function useAppState() {
  const [screen, setScreen] = useState<Screen>('auth');
  const [previousScreen, setPreviousScreen] = useState<Screen | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'locataire' | 'propriétaire'>('locataire');
  const [favorites, setFavorites] = useState<string[]>(['p1', 'p6']);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [filters, setFiltersState] = useState<FilterState>(defaultFilters);
  const [searchQuery, setSearchQueryState] = useState('');
  const [unreadMessages, setUnreadMessages] = useState(2);
  const [unreadNotifications, setUnreadNotifications] = useState(3);

  const currentUser: User = { ...mockUsers[0], role: userRole };

  const navigate = useCallback((newScreen: Screen, property?: Property, conversationId?: string) => {
    setPreviousScreen(screen);
    setScreen(newScreen);
    if (property) setSelectedProperty(property);
    if (conversationId !== undefined) setSelectedConversationId(conversationId);
  }, [screen]);

  const goBack = useCallback(() => {
    if (previousScreen) { setScreen(previousScreen); setPreviousScreen(null); }
    else setScreen('home');
  }, [previousScreen]);

  const setAuthenticated = useCallback((role: 'locataire' | 'propriétaire') => {
    setUserRole(role);
    setIsAuthenticated(true);
    setScreen(role === 'propriétaire' ? 'landlord-dashboard' : 'home');
  }, []);

  const logout = useCallback(() => { setIsAuthenticated(false); setScreen('auth'); }, []);

  const toggleFavorite = useCallback((propertyId: string) => {
    setFavorites(prev => prev.includes(propertyId) ? prev.filter(id => id !== propertyId) : [...prev, propertyId]);
  }, []);

  const toggleCompare = useCallback((propertyId: string) => {
    setCompareList(prev => {
      if (prev.includes(propertyId)) return prev.filter(id => id !== propertyId);
      if (prev.length >= 3) return prev;
      return [...prev, propertyId];
    });
  }, []);

  const clearCompare = useCallback(() => setCompareList([]), []);
  const setFilters = useCallback((f: FilterState) => setFiltersState(f), []);
  const resetFilters = useCallback(() => setFiltersState(defaultFilters), []);
  const setSearchQuery = useCallback((q: string) => setSearchQueryState(q), []);
  const markNotificationsRead = useCallback(() => setUnreadNotifications(0), []);
  const markMessagesRead = useCallback(() => setUnreadMessages(0), []);

  return {
    screen, previousScreen, selectedProperty, selectedConversationId,
    currentUser, isAuthenticated, userRole, favorites, compareList,
    filters, searchQuery, unreadMessages, unreadNotifications,
    navigate, goBack, setAuthenticated, logout, toggleFavorite, toggleCompare,
    clearCompare, setFilters, resetFilters, setSearchQuery,
    markNotificationsRead, markMessagesRead,
  };
}
