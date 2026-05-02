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
import ProUpgradeModal from "./components/ProUpgradeModal.jsx";
import RedeemPackModal from "./components/RedeemPackModal.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

/* ─── Route components ──────────────────────────────────────── */

function ShelfRoute({ journals, setJournals, activeJournal, setActiveJournal,
  showNewJournal, setShowNewJournal, journalForm, setJournalForm,
  onOpenJournal, onSignOut, onDeleteAccount, menuOpen, setMenuOpen,
  renaming, setRenaming, confirmDelete, setConfirmDelete,
  onShowUpgrade, userTier, onShowRedeem, redeemUsed,
  showUpgradePro, setShowUpgradePro, showRedeemPack, setShowRedeemPack,
  unlockedCategory, handleRedeem, onUpgrade }) {
  const { user, loading } = useContext(AuthContext);
  if (loading) return null;
  return (
    <>
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
      {showUpgradePro && (
        <ProUpgradeModal userTier={userTier} onClose={() => setShowUpgradePro(false)}
          onUpgrade={onUpgrade} />
      )}
      {showRedeemPack && (
        <RedeemPackModal redeemUsed={redeemUsed} unlockedCategory={unlockedCategory}
          onClose={() => setShowRedeemPack(false)} onRedeem={handleRedeem} />
      )}
    </>
  );
}

function JournalRoute({ journals, setJournals, activeJournal, setActiveJournal, setActiveSpread, setJournalPage,
  navigate, journalPage, showTemplatePicker, setShowTemplatePicker, userTier, onToggleTier,
  confirmSpread, setConfirmSpread, renamingSpread, setRenamingSpread, onShowUpgrade,
  showUpgradePro, setShowUpgradePro, onUpgrade, unlockedCategory }) {
  const { journalId } = useParams();
  const journal = journals.find(j => j.id === journalId);

  useEffect(() => {
    if (!journal) return;

    const loadSpreads = async () => {
      const spreads = await getSpreads(journal.id);

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

  useEffect(() => {
    if (journal) {
      setActiveJournal(journal);
      setActiveSpread(null);
      setJournalPage(p => Math.min(p, journal.spreads.length));
    }
  }, [journalId, journal, setActiveJournal, setActiveSpread, setJournalPage]);

  if (!journal) return <Navigate to="/shelf" replace />;

  return (
    <>
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
      {showUpgradePro && (
        <ProUpgradeModal userTier={userTier} onClose={() => setShowUpgradePro(false)}
          onUpgrade={onUpgrade} />
      )}
    </>
  );
}

function SpreadRoute({ journals, setJournals, activeJournal, setActiveJournal, setActiveSpread, navigate,
  showUpgradePro, setShowUpgradePro, userTier, onUpgrade }) {
  const { journalId, spreadId } = useParams();
  const journal = journals.find(j => j.id === journalId);
  const spread  = journal?.spreads.find(s => s.id === spreadId);

  useEffect(() => {
    if (journal) setActiveJournal(journal);
    if (spread)  setActiveSpread(spread);
  }, [journal, spread, setActiveJournal, setActiveSpread]);

  if (!journal || !spread) return <Navigate to="/shelf" replace />;

  return (
    <>
      <SpreadEditorPage
        journals={journals}
        setJournals={setJournals}
        activeJournal={activeJournal}
        setActiveJournal={setActiveJournal}
        setActiveSpread={setActiveSpread}
        onGoHome={() => navigate("/shelf")}
        onGoJournal={() => navigate(`/shelf/journal/${journal.id}`)}
      />
      {showUpgradePro && (
        <ProUpgradeModal userTier={userTier} onClose={() => setShowUpgradePro(false)}
          onUpgrade={onUpgrade} />
      )}
    </>
  );
}

/* ─── Root App ──────────────────────────────────────────────── */

export default function App() {
  const [journals,           setJournals]           = useState([]);
  const [activeJournal,      setActiveJournal]      = useState(null);
  const [activeSpread,       setActiveSpread]       = useState(null);
  const [showNewJournal,     setShowNewJournal]     = useState(false);
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  const [userTier,           setUserTier]           = useState("free");
  const [journalPage,        setJournalPage]        = useState(0);
  const [journalForm,        setJournalForm]        = useState({ title:"", coverType:"upload", coverId:"upload", coverImg:null });
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

  useEffect(() => {
    if (!menuOpen) return;
    const close = () => setMenuOpen(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [menuOpen]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleDeleteAccount = async () => {
    await supabase.auth.signOut();
    setJournals([]);
    navigate("/auth");
  };

  const { user } = useContext(AuthContext);
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

  const handleRedeem = (category) => {
    setRedeemUsed(true);
    setUnlockedCategory(category);
    setShowRedeemPack(false);
    setTimeout(() => setShowRedeemPack(true), 50);
  };

  const sharedShelfProps = {
    journals, setJournals, activeJournal, setActiveJournal,
    showNewJournal, setShowNewJournal, journalForm, setJournalForm,
    onOpenJournal: j => { setActiveJournal(j); setJournalPage(0); navigate(`/shelf/journal/${j.id}`); },
    onSignOut: handleSignOut,
    onDeleteAccount: handleDeleteAccount,
    menuOpen, setMenuOpen, renaming, setRenaming,
    confirmDelete, setConfirmDelete,
    onShowUpgrade: () => setShowUpgradePro(true),
    userTier,
    onShowRedeem: () => setShowRedeemPack(true),
    redeemUsed,
    showUpgradePro, setShowUpgradePro,
    showRedeemPack, setShowRedeemPack,
    unlockedCategory, handleRedeem,
    onUpgrade: () => { setUserTier("pro"); setShowUpgradePro(false); },
  };

  const sharedJournalProps = {
    journals, setJournals, activeJournal, setActiveJournal,
    setActiveSpread, setJournalPage, navigate, journalPage,
    showTemplatePicker, setShowTemplatePicker, userTier,
    onToggleTier: () => setUserTier(t => t === "free" ? "pro" : "free"),
    confirmSpread, setConfirmSpread, renamingSpread, setRenamingSpread,
    onShowUpgrade: () => setShowUpgradePro(true),
    showUpgradePro, setShowUpgradePro,
    onUpgrade: () => { setUserTier("pro"); setShowUpgradePro(false); },
    unlockedCategory,
  };

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/auth" element={<AuthPage />} />

      {/* Protected routes */}
      <Route path="/shelf" element={
        <ProtectedRoute><ShelfRoute {...sharedShelfProps} /></ProtectedRoute>
      } />
      <Route path="/shelf/journal/:journalId" element={
        <ProtectedRoute><JournalRoute {...sharedJournalProps} /></ProtectedRoute>
      } />
      <Route path="/shelf/journal/:journalId/spread/:spreadId" element={
        <ProtectedRoute>
          <SpreadRoute
            journals={journals} setJournals={setJournals}
            activeJournal={activeJournal} setActiveJournal={setActiveJournal}
            setActiveSpread={setActiveSpread} navigate={navigate}
            showUpgradePro={showUpgradePro} setShowUpgradePro={setShowUpgradePro}
            userTier={userTier}
            onUpgrade={() => { setUserTier("pro"); setShowUpgradePro(false); }}
          />
        </ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
