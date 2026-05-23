import { useEffect, useRef, useState } from "react";
import { uid, now } from "./constants.js";
import { Routes, Route, useNavigate, useParams, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { supabase } from "./lib/supabase";
import { getJournals } from "./lib/journals";
import { getSpreads } from "./lib/spreads";

import HomePage from "./pages/HomePage.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import JournalShelfPage from "./pages/JournalShelfPage.jsx";
import JournalPage from "./pages/JournalPage.jsx";
import SpreadEditorPage from "./pages/SpreadEditorPage.jsx";
import PaymentPage from "./pages/PaymentPage.jsx";
import ProUpgradeModal from "./components/ProUpgradeModal.jsx";
import RedeemPackModal from "./components/RedeemPackModal.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

// Shelf route also contains the upgrade modals
function ShelfRoute({ journals, setJournals, activeJournal, setActiveJournal,
  showNewJournal, setShowNewJournal, journalForm, setJournalForm,
  onOpenJournal, onSignOut, onDeleteAccount, menuOpen, setMenuOpen,
  renaming, setRenaming, confirmDelete, setConfirmDelete,
  onShowUpgrade, userTier, onShowRedeem, redeemUsed,
  showUpgradePro, setShowUpgradePro, showRedeemPack, setShowRedeemPack,
  unlockedCategory, handleRedeem, onUpgrade }) {
  // AuthContext is needed here to get the user for the shelf page
  const { user, loading } = useContext(AuthContext);
  // If AuthContext is still loading, don't render anything
  if (loading) return null;
  return (
    <>
    {/* Journal Shelf Page */}
      <JournalShelfPage
        user={user}
        journals={journals}
        setJournals={setJournals}
        activeJournal={activeJournal}
        setActiveJournal={setActiveJournal}
        showNewJournal={showNewJournal}
        setShowNewJournal={setShowNewJournal}
        journalForm={journalForm}
        setJournalForm={setJournalForm}
        onOpenJournal={onOpenJournal}
        onSignOut={onSignOut}
        onDeleteAccount={onDeleteAccount}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        renaming={renaming}
        setRenaming={setRenaming}
        confirmDelete={confirmDelete}
        setConfirmDelete={setConfirmDelete}
        onShowUpgrade={onShowUpgrade}
        userTier={userTier}
        onShowRedeem={onShowRedeem}
        redeemUsed={redeemUsed}
      />
      {/* Pro Upgrade Modal */}
      {showUpgradePro && (
        <ProUpgradeModal userTier={userTier} onClose={() => setShowUpgradePro(false)}
          onUpgrade={onUpgrade} />
      )}
      {/* Redeem Pack Modal */}
      {showRedeemPack && (
        <RedeemPackModal redeemUsed={redeemUsed} unlockedCategory={unlockedCategory}
          onClose={() => setShowRedeemPack(false)} onRedeem={handleRedeem} />
      )}
    </>
  );
}

// Journal route also contains the upgrade modal and template picker
function JournalRoute({ journals, setJournals, activeJournal, setActiveJournal, setActiveSpread, setJournalPage,
  navigate, journalPage, showTemplatePicker, setShowTemplatePicker, userTier, onToggleTier,
  confirmSpread, setConfirmSpread, renamingSpread, setRenamingSpread, onShowUpgrade,
  showUpgradePro, setShowUpgradePro, onUpgrade, unlockedCategory }) {
  const { journalId } = useParams();
  const journal = journals.find(j => j.id === journalId);
  // Load spreads for this journal if not already loaded 
  useEffect(() => {
    if (!journal) return;
    // If spreads are already loaded, no need to fetch again
    const loadSpreads = async () => {
      const spreads = await getSpreads(journal.id);
      // Update the journal with its spreads and update state
      const updatedJournal = {
        ...journal,
        spreads
      };
      // If the active journal is the one we just updated, update it in state as well
      setActiveJournal(updatedJournal);
      setJournals(p =>
        p.map(j => j.id === journal.id ? updatedJournal : j)
      );
    };
    // Only load spreads if they haven't been loaded before
    loadSpreads();
  }, [journalId]);
  // When journalId changes, set the active journal and reset active spread and page
  useEffect(() => {
    if (journal) {
      setActiveJournal(journal);
      setActiveSpread(null);
      setJournalPage(p => Math.min(p, journal.spreads.length));
    }
  }, [journalId, journal, setActiveJournal, setActiveSpread, setJournalPage]);
  // If journal doesn't exist (invalid ID), navigate back to shelf
  if (!journal) return <Navigate to="/shelf" replace />;
  return (
    <>
    {/* Journal Page */}
      <JournalPage
        journals={journals}
        setJournals={setJournals}
        activeJournal={activeJournal}
        setActiveJournal={setActiveJournal}
        setActiveSpread={setActiveSpread}
        setJournalPage={setJournalPage}
        navigate={navigate}
        journalPage={journalPage}
        showTemplatePicker={showTemplatePicker}
        setShowTemplatePicker={setShowTemplatePicker}
        userTier={userTier}
        onToggleTier={onToggleTier}
        confirmSpread={confirmSpread}
        setConfirmSpread={setConfirmSpread}
        renamingSpread={renamingSpread}
        setRenamingSpread={setRenamingSpread}
        onGoHome={() => navigate("/shelf")}
        onEditSpread={spread => { setActiveSpread(spread); navigate(`/shelf/journal/${journal.id}/spread/${spread.id}`); }}
        onShowUpgrade={onShowUpgrade}
        unlockedCategory={unlockedCategory}
      />
      {/* Pro Upgrade Modal */}
      {showUpgradePro && (
        <ProUpgradeModal userTier={userTier} onClose={() => setShowUpgradePro(false)}
          onUpgrade={onUpgrade} />
      )}
    </>
  );
}

// Spread route also contains the upgrade modal
function SpreadRoute({ journals, setJournals, activeJournal, setActiveJournal, setActiveSpread, navigate,
  showUpgradePro, setShowUpgradePro, userTier, onUpgrade }) {
  const { journalId, spreadId } = useParams();
  const journal = journals.find(j => j.id === journalId);
  const spread  = journal?.spreads.find(s => s.id === spreadId);
  // When journal or spread changes, set the active journal and spread in state
  useEffect(() => {
    if (journal) setActiveJournal(journal);
    if (spread)  setActiveSpread(spread);
  }, [journal, spread, setActiveJournal, setActiveSpread]);
  // If journal or spread doesn't exist (invalid ID), navigate back to shelf
  if (!journal || !spread) return <Navigate to="/shelf" replace />;
  return (
    <>
    {/* Spread Editor Page */}
      <SpreadEditorPage
        journals={journals}
        setJournals={setJournals}
        activeJournal={activeJournal}
        setActiveJournal={setActiveJournal}
        setActiveSpread={setActiveSpread}
        onGoHome={() => navigate("/shelf")}
        onGoJournal={() => navigate(`/shelf/journal/${journal.id}`)}
      />
      {/* Pro Upgrade Modal */}
      {showUpgradePro && (
        <ProUpgradeModal userTier={userTier} onClose={() => setShowUpgradePro(false)}
          onUpgrade={onUpgrade} />
      )}
    </>
  );
}

/* Root App */
export default function App() {
  const [journals,           setJournals]           = useState([]);
  const [activeJournal,      setActiveJournal]      = useState(null);
  const [activeSpread,       setActiveSpread]       = useState(null);
  const [showNewJournal,     setShowNewJournal]     = useState(false);
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  const [journalPage,        setJournalPage]        = useState(0);
  const [journalForm,        setJournalForm]        = useState({ title:"", coverType:"image", coverId:"upload", coverImg:null });
  const [menuOpen,           setMenuOpen]           = useState(null);
  const [renaming,           setRenaming]           = useState(null);
  const [confirmDelete,      setConfirmDelete]      = useState(null);
  const [confirmSpread,      setConfirmSpread]      = useState(null);
  const [renamingSpread,     setRenamingSpread]     = useState(null);
  const [showUpgradePro,     setShowUpgradePro]     = useState(false);
  const [showRedeemPack,     setShowRedeemPack]     = useState(false);
  const [redeemUsed,         setRedeemUsed]         = useState(false);
  const [unlockedCategory,   setUnlockedCategory]   = useState(null);

  const navigate = useNavigate();

  // Derive tier from AuthContext (single source of truth = Supabase profiles)
  const { user, tier: userTier } = useContext(AuthContext);

  // Global click listener to close any open menu when clicking outside
  useEffect(() => {
    if (!menuOpen) return;
    const close = () => setMenuOpen(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [menuOpen]);

  // When user changes (sign in/out), load journals or clear them
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  // When deleting account, sign out and clear journals
  const handleDeleteAccount = async () => {
    await supabase.auth.signOut();
    setJournals([]);
    navigate("/auth");
  };

  // if user is null, clear journals. If user exists, load their journals. 
  useEffect(() => {
    if (!user) {
      setJournals([]);
      return;
    }
    const load = async () => {
      const data = await getJournals();
      setJournals(data);
    };
    load();
  }, [user]);

  // Handle redeeming a pack: mark as used, unlock the category, and show the pack animation
  const handleRedeem = (category) => {
    setRedeemUsed(true);
    setUnlockedCategory(category);
    setShowRedeemPack(false);
    setTimeout(() => setShowRedeemPack(true), 50);
  };

  // Navigate to payment page instead of directly upgrading
  const handleShowUpgrade = () => {
    setShowUpgradePro(true);
  };

  // When user clicks upgrade in the modal, navigate to payment page
  const handleGoToPayment = () => {
    setShowUpgradePro(false);
    navigate("/upgrade");
  };

  // Props shared between Shelf and Journal routes 
  const sharedShelfProps = {
    journals, setJournals, activeJournal, setActiveJournal,
    showNewJournal, setShowNewJournal, journalForm, setJournalForm,
    onOpenJournal: j => { setActiveJournal(j); setJournalPage(0); navigate(`/shelf/journal/${j.id}`); },
    onSignOut: handleSignOut,
    onDeleteAccount: handleDeleteAccount,
    menuOpen, setMenuOpen, renaming, setRenaming,
    confirmDelete, setConfirmDelete,
    onShowUpgrade: handleShowUpgrade,
    userTier,
    onShowRedeem: () => setShowRedeemPack(true),
    redeemUsed,
    showUpgradePro, setShowUpgradePro,
    showRedeemPack, setShowRedeemPack,
    unlockedCategory, handleRedeem,
    // onUpgrade goes to payment page
    onUpgrade: handleGoToPayment,
  };

  // Props shared between Journal and Spread routes
  const sharedJournalProps = {
    journals, setJournals, activeJournal, setActiveJournal,
    setActiveSpread, setJournalPage, navigate, journalPage,
    showTemplatePicker, setShowTemplatePicker, userTier,
    onToggleTier: () => {},   // no more local toggle
    confirmSpread, setConfirmSpread, renamingSpread, setRenamingSpread,
    onShowUpgrade: handleShowUpgrade,
    showUpgradePro, setShowUpgradePro,
    onUpgrade: handleGoToPayment,
    unlockedCategory,
  };

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/auth" element={<AuthPage />} />

      {/* Payment / upgrade route (protected) */}
      <Route path="/upgrade" element={
        <ProtectedRoute><PaymentPage /></ProtectedRoute>
      } />

      {/* Protected route to shelf */}
      <Route path="/shelf" element={
        <ProtectedRoute><ShelfRoute {...sharedShelfProps} /></ProtectedRoute>
      } />
      
      {/* Journal Page */}
      <Route path="/shelf/journal/:journalId" element={
        <ProtectedRoute><JournalRoute {...sharedJournalProps} /></ProtectedRoute>
      } />

      {/* Spread Editor Page */}
      <Route path="/shelf/journal/:journalId/spread/:spreadId" element={
        <ProtectedRoute>
          <SpreadRoute
            journals={journals} setJournals={setJournals}
            activeJournal={activeJournal} setActiveJournal={setActiveJournal}
            setActiveSpread={setActiveSpread} navigate={navigate}
            showUpgradePro={showUpgradePro} setShowUpgradePro={setShowUpgradePro}
            userTier={userTier}
            onUpgrade={handleGoToPayment}
          />
        </ProtectedRoute>
      } />

      {/* if no route matches, redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}