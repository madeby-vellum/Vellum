import { useEffect, useRef, useState } from "react";
import { uid, now } from "./constants.js";
import { Routes, Route, useNavigate, useParams, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { supabase } from "./lib/supabase";
import { getJournals } from "./lib/journals";
import { getSpreads } from "./lib/spreads";

// import pages and components
import HomePage from "./pages/HomePage.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import JournalShelfPage from "./pages/JournalShelfPage.jsx";
import JournalPage from "./pages/JournalPage.jsx";
import SpreadEditorPage from "./pages/SpreadEditorPage.jsx";
import PaymentPage from "./pages/PaymentPage.jsx";
import ProUpgradeModal from "./components/ProUpgradeModal.jsx";
import RedeemPackModal from "./components/RedeemPackModal.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

/* ─── Route components ──────────────────────────────────────── */

// define ShelfRoute component to handle journal shelf page
function ShelfRoute({
  journals,
  setJournals,
  activeJournal,
  setActiveJournal,
  showNewJournal,
  setShowNewJournal,
  journalForm,
  setJournalForm,
  onOpenJournal,
  onSignOut,
  onDeleteAccount,
  menuOpen,
  setMenuOpen,
  renaming,
  setRenaming,
  confirmDelete,
  setConfirmDelete,
  onShowUpgrade,
  userTier,
  onShowRedeem,
  redeemUsed,
  showUpgradePro,
  setShowUpgradePro,
  showRedeemPack,
  setShowRedeemPack,
  unlockedCategory,
  handleRedeem,
  onUpgrade
}) {

  // Auth context for current user + loading state
  const { user, loading } = useContext(AuthContext);

  // Prevent rendering until auth state is ready
  if (loading) return null;

  return (
    <>
      {/* Main journal shelf UI */}
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

      {/* Pro upgrade modal */}
      {showUpgradePro && (
        <ProUpgradeModal
          userTier={userTier}
          onClose={() => setShowUpgradePro(false)}
          onUpgrade={onUpgrade}
        />
      )}

      {/* Redeem pack modal */}
      {showRedeemPack && (
        <RedeemPackModal
          redeemUsed={redeemUsed}
          unlockedCategory={unlockedCategory}
          onClose={() => setShowRedeemPack(false)}
          onRedeem={handleRedeem}
        />
      )}
    </>
  );
}

// define JournalRoute component to handle individual journal page
function JournalRoute({
  journals,
  setJournals,
  activeJournal,
  setActiveJournal,
  setActiveSpread,
  setJournalPage,
  navigate,
  journalPage,
  showTemplatePicker,
  setShowTemplatePicker,
  userTier,
  onToggleTier,
  confirmSpread,
  setConfirmSpread,
  renamingSpread,
  setRenamingSpread,
  onShowUpgrade,
  showUpgradePro,
  setShowUpgradePro,
  onUpgrade,
  unlockedCategory
}) {

  // Get journal ID from URL
  const { journalId } = useParams();

  // Find journal from state
  const journal = journals.find(j => j.id === journalId);

  // Load spreads when journal changes
  useEffect(() => {
    if (!journal) return;

    const loadSpreads = async () => {
      const spreads = await getSpreads(journal.id);

      // Merge spreads into journal object
      const updatedJournal = {
        ...journal,
        spreads
      };

      setActiveJournal(updatedJournal);

      setJournals(p =>
        p.map(j => j.id === journal.id ? updatedJournal : j)
      );
    };

    loadSpreads();
  }, [journalId]);

  // Sync active journal + reset spread state when switching journals
  useEffect(() => {
    if (journal) {
      setActiveJournal(journal);
      setActiveSpread(null);
      setJournalPage(p => Math.min(p, journal.spreads.length));
    }
  }, [journalId, journal, setActiveJournal, setActiveSpread, setJournalPage]);

  // Redirect if journal doesn't exist
  if (!journal) return <Navigate to="/shelf" replace />;

  return (
    <>
      {/* Journal page UI */}
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
        onEditSpread={spread => {
          setActiveSpread(spread);
          navigate(`/shelf/journal/${journal.id}/spread/${spread.id}`);
        }}
        onShowUpgrade={onShowUpgrade}
        unlockedCategory={unlockedCategory}
      />

      {/* Upgrade modal */}
      {showUpgradePro && (
        <ProUpgradeModal
          userTier={userTier}
          onClose={() => setShowUpgradePro(false)}
          onUpgrade={onUpgrade}
        />
      )}
    </>
  );
}

// define SpreadRoute component to handle spread editor page
function SpreadRoute({
  journals,
  setJournals,
  activeJournal,
  setActiveJournal,
  setActiveSpread,
  navigate,
  showUpgradePro,
  setShowUpgradePro,
  userTier,
  onUpgrade
}) {

  // Get route params for journal + spread
  const { journalId, spreadId } = useParams();

  // Find journal + spread from state
  const journal = journals.find(j => j.id === journalId);
  const spread = journal?.spreads.find(s => s.id === spreadId);

  // Sync active journal + spread into global state
  useEffect(() => {
    if (journal) setActiveJournal(journal);
    if (spread) setActiveSpread(spread);
  }, [journal, spread, setActiveJournal, setActiveSpread]);

  // Redirect if invalid route
  if (!journal || !spread) return <Navigate to="/shelf" replace />;

  return (
    <>
      {/* Spread editor page */}
      <SpreadEditorPage
        journals={journals}
        setJournals={setJournals}
        activeJournal={activeJournal}
        setActiveJournal={setActiveJournal}
        setActiveSpread={setActiveSpread}
        onGoHome={() => navigate("/shelf")}
        onGoJournal={() => navigate(`/shelf/journal/${journal.id}`)}
      />

      {/* Upgrade modal */}
      {showUpgradePro && (
        <ProUpgradeModal
          userTier={userTier}
          onClose={() => setShowUpgradePro(false)}
          onUpgrade={onUpgrade}
        />
      )}
    </>
  );
}

/* ─── Root App ──────────────────────────────────────────────── */

export default function App() {

  // Core app state: journals + selection state
  const [journals, setJournals] = useState([]);
  const [activeJournal, setActiveJournal] = useState(null);
  const [activeSpread, setActiveSpread] = useState(null);

  // UI state for journal creation + editing
  const [showNewJournal, setShowNewJournal] = useState(false);
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  const [journalPage, setJournalPage] = useState(0);

  // Form state for new journal creation
  const [journalForm, setJournalForm] = useState({
    title: "",
    coverType: "image",
    coverId: "upload",
    coverImg: null
  });

  // Context menu + edit states
  const [menuOpen, setMenuOpen] = useState(null);
  const [renaming, setRenaming] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [confirmSpread, setConfirmSpread] = useState(null);
  const [renamingSpread, setRenamingSpread] = useState(null);

  // Upgrade + redeem modals
  const [showUpgradePro, setShowUpgradePro] = useState(false);
  const [showRedeemPack, setShowRedeemPack] = useState(false);

  // Redemption tracking
  const [redeemUsed, setRedeemUsed] = useState(false);
  const [unlockedCategory, setUnlockedCategory] = useState(null);

  // Router navigation
  const navigate = useNavigate();

  // Auth context (user + tier info)
  const { user, tier: userTier } = useContext(AuthContext);

  // Close context menu when clicking outside
  useEffect(() => {
    if (!menuOpen) return;
    const close = () => setMenuOpen(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [menuOpen]);

  // Sign out user
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  // Delete account (simplified: signs out + clears state)
  const handleDeleteAccount = async () => {
    await supabase.auth.signOut();
    setJournals([]);
    navigate("/auth");
  };

  // Load journals when user logs in
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

  // Handle redeem pack action
  const handleRedeem = (category) => {
    setRedeemUsed(true);
    setUnlockedCategory(category);
    setShowRedeemPack(false);
    setTimeout(() => setShowRedeemPack(true), 50);
  };

  // Open upgrade modal
  const handleShowUpgrade = () => {
    setShowUpgradePro(true);
  };

  // Navigate to payment page instead of direct upgrade
  const handleGoToPayment = () => {
    setShowUpgradePro(false);
    navigate("/upgrade");
  };

  // Shared props for shelf UI
  const sharedShelfProps = {
    journals,
    setJournals,
    activeJournal,
    setActiveJournal,
    showNewJournal,
    setShowNewJournal,
    journalForm,
    setJournalForm,
    onOpenJournal: j => {
      setActiveJournal(j);
      setJournalPage(0);
      navigate(`/shelf/journal/${j.id}`);
    },
    onSignOut: handleSignOut,
    onDeleteAccount: handleDeleteAccount,
    menuOpen,
    setMenuOpen,
    renaming,
    setRenaming,
    confirmDelete,
    setConfirmDelete,
    onShowUpgrade: handleShowUpgrade,
    userTier,
    onShowRedeem: () => setShowRedeemPack(true),
    redeemUsed,
    showUpgradePro,
    setShowUpgradePro,
    showRedeemPack,
    setShowRedeemPack,
    unlockedCategory,
    handleRedeem,
    onUpgrade: handleGoToPayment,
  };

  // Shared props for journal UI
  const sharedJournalProps = {
    journals,
    setJournals,
    activeJournal,
    setActiveJournal,
    setActiveSpread,
    setJournalPage,
    navigate,
    journalPage,
    showTemplatePicker,
    setShowTemplatePicker,
    userTier,
    onToggleTier: () => {},
    confirmSpread,
    setConfirmSpread,
    renamingSpread,
    setRenamingSpread,
    onShowUpgrade: handleShowUpgrade,
    showUpgradePro,
    setShowUpgradePro,
    onUpgrade: handleGoToPayment,
    unlockedCategory,
  };

  return (
    <Routes>

      {/* Public routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/auth" element={<AuthPage />} />

      {/* Protected upgrade route */}
      <Route
        path="/upgrade"
        element={
          <ProtectedRoute>
            <PaymentPage />
          </ProtectedRoute>
        }
      />

      {/* Shelf route */}
      <Route
        path="/shelf"
        element={
          <ProtectedRoute>
            <ShelfRoute {...sharedShelfProps} />
          </ProtectedRoute>
        }
      />

      {/* Journal route */}
      <Route
        path="/shelf/journal/:journalId"
        element={
          <ProtectedRoute>
            <JournalRoute {...sharedJournalProps} />
          </ProtectedRoute>
        }
      />

      {/* Spread editor route */}
      <Route
        path="/shelf/journal/:journalId/spread/:spreadId"
        element={
          <ProtectedRoute>
            <SpreadRoute
              journals={journals}
              setJournals={setJournals}
              activeJournal={activeJournal}
              setActiveJournal={setActiveJournal}
              setActiveSpread={setActiveSpread}
              navigate={navigate}
              showUpgradePro={showUpgradePro}
              setShowUpgradePro={setShowUpgradePro}
              userTier={userTier}
              onUpgrade={handleGoToPayment}
            />
          </ProtectedRoute>
        }
      />

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}