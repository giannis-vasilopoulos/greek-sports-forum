export type MockReplyFixture = {
  authorKey: string;
  content: string;
  minutesAfterOp: number;
  /** Index in the thread post list (0 = OP). */
  parentIndex?: number;
  score?: number;
  likeCount?: number;
  isCollapsed?: boolean;
  isEdited?: boolean;
};

export type MockThreadPostsFixture = {
  opAuthorKey?: string;
  op: string;
  replies: MockReplyFixture[];
};

/** Thread 42 is the primary showcase for all post UI states. */
export const MOCK_THREAD_POST_FIXTURES: Record<number, MockThreadPostsFixture> =
  {
    42: {
      opAuthorKey: "pao",
      op: `Ξεκινάμε live συζήτηση για το ντέρμπι Παναθηναϊκός — Ολυμπιακός.

Γράψτε γκολ, τακτικές, αλλαγές και φάσεις που σας ενοχλούν.
Κρατάμε τον σεβασμό — κανένα προσωπικό attack.`,
      replies: [
        {
          authorKey: "olympiakos",
          content: "ΓΚΟΟΟΛ! 1-0 Ολυμπιακός!",
          minutesAfterOp: 1,
          score: 8,
          likeCount: 9,
        },
        {
          authorKey: "pao",
          content: "Ακόμα νωρίς — η ομάδα μας ανεβαίνει ρυθμικά.",
          minutesAfterOp: 2,
          parentIndex: 1,
          score: 5,
          likeCount: 5,
        },
        {
          authorKey: "neutral",
          content: `Τακτική ανάλυση 25':
• Παναθηναϊκός: πιέζει ψηλά, αλλά αφήνει χώρο στις πλάγιες.
• Ολυμπιακός: κρατά κατοχή, ψάχνει την κόντρα με Γιάννη.`,
          minutesAfterOp: 4,
          score: 24,
          likeCount: 22,
        },
        {
          authorKey: "troll",
          content: "Όλοι οι διαιτητές είναι εναντίον μας, κλασικό.",
          minutesAfterOp: 5,
          score: -6,
          likeCount: 0,
          isCollapsed: true,
        },
        {
          authorKey: "aek",
          content: "Διορθώνω: το γκολ ήταν οφσάιντ, το VAR το κοίταξε 3 λεπτά.",
          minutesAfterOp: 6,
          isEdited: true,
          score: 3,
          likeCount: 2,
        },
        {
          authorKey: "pao",
          content:
            "Ποιος παίκτης σας έχει κάνει τη μεγαλύτερη διαφορά μέχρι τώρα;",
          minutesAfterOp: 8,
          parentIndex: 0,
          score: 1,
          likeCount: 1,
        },
        {
          authorKey: "olympiakos",
          content: "Ο Πιέρικος. Τελεία.",
          minutesAfterOp: 9,
          parentIndex: 6,
          score: 4,
          likeCount: 4,
        },
        {
          authorKey: "neutral",
          content: "Κ.",
          minutesAfterOp: 10,
          score: 0,
          likeCount: 0,
        },
      ],
    },
    38: {
      opAuthorKey: "aek",
      op: "ΑΕΚ — ΠΑΟΚ απόψε. Ποιο είναι το σκορ που περιμένετε και γιατί;",
      replies: [
        {
          authorKey: "pao",
          content: "2-1 ΑΕΚ, εντός έδρας και με κόσμο.",
          minutesAfterOp: 12,
          score: 6,
          likeCount: 6,
        },
        {
          authorKey: "neutral",
          content: "1-1. Κλείνουν οι χώροι, δύσκολο να ξεφύγει κάποιος.",
          minutesAfterOp: 25,
          score: 11,
          likeCount: 10,
        },
        {
          authorKey: "olympiakos",
          content: "Θέλω να δω αν ο Αραούχο θα παίξει από την αρχή.",
          minutesAfterOp: 40,
          parentIndex: 0,
          score: 2,
          likeCount: 2,
        },
      ],
    },
    15: {
      opAuthorKey: "neutral",
      op: "Πάλι θέμα διαιτησίας αυτή την αγωνιστική. Ποια φάση σας ενοχλεί περισσότερο;",
      replies: [
        {
          authorKey: "pao",
          content: "Στο 67' Παναθηναϊκός — ΑΕΚ: πέναλτι που δεν δόθηκε.",
          minutesAfterOp: 30,
          score: 15,
          likeCount: 14,
        },
        {
          authorKey: "aek",
          content: "Διαφωνώ — ο παίκτης βουτάει μόνος του, καθαρή πτώση.",
          minutesAfterOp: 45,
          parentIndex: 1,
          score: 7,
          likeCount: 6,
        },
        {
          authorKey: "neutral",
          content:
            "Ο VAR πρέπει να εξηγεί τις αποφάσεις μετά τον αγώνα, όχι μόνο να τις δείχνει.",
          minutesAfterOp: 60,
          score: 19,
          likeCount: 18,
        },
        {
          authorKey: "troll",
          content: "Όλοι διαιτητές πληρωμένοι, ξέρετε εσείς.",
          minutesAfterOp: 75,
          score: -8,
          likeCount: 0,
          isCollapsed: true,
        },
      ],
    },
    31: {
      opAuthorKey: "arsenal",
      op: "Arsenal vs Chelsea — pre-match thread. Lineups, predictions, banter.",
      replies: [
        {
          authorKey: "chelsea",
          content: "2-0 Chelsea. Palmer decides it late.",
          minutesAfterOp: 10,
          score: 3,
          likeCount: 3,
        },
        {
          authorKey: "arsenal",
          content: "Saka starts — we press high from minute one.",
          minutesAfterOp: 18,
          parentIndex: 1,
          score: 5,
          likeCount: 5,
        },
        {
          authorKey: "neutral",
          content: "xG says tight game. I'll take 1-1.",
          minutesAfterOp: 30,
          score: 9,
          likeCount: 8,
        },
      ],
    },
    28: {
      opAuthorKey: "madrid",
      op: "Κλήρωση Champions League — τι λέτε για τον όμιλο της Ολυμπιακού;",
      replies: [
        {
          authorKey: "barca",
          content: "Δύσκολος όμιλος, αλλά υπάρχει πρόοδος.",
          minutesAfterOp: 15,
          score: 4,
          likeCount: 4,
        },
        {
          authorKey: "madrid",
          content: "Θα περάσει δεύτερη — το έχει δείξει και στο Europa.",
          minutesAfterOp: 28,
          parentIndex: 1,
          score: 6,
          likeCount: 5,
        },
      ],
    },
    25: {
      opAuthorKey: "olym_bc",
      op: "Τελικό σκορ 88-82. Τι σας έκανε εντύπωση στο derby της Euroleague;",
      replies: [
        {
          authorKey: "pao_bc",
          content: "Η άμυνα στο τρίτο δεκάλεpto — κλειδί του αγώνα.",
          minutesAfterOp: 20,
          score: 10,
          likeCount: 9,
        },
        {
          authorKey: "olym_bc",
          content: "Σύμφωνοι. Και τα ελεύθερα από τη γραμμή.",
          minutesAfterOp: 35,
          parentIndex: 1,
          score: 3,
          likeCount: 3,
        },
      ],
    },
    12: {
      opAuthorKey: "neutral",
      op: "Premier League title race — Arsenal, Liverpool ή έκπληξη;",
      replies: [
        {
          authorKey: "arsenal",
          content: "Arsenal. Depth + set pieces.",
          minutesAfterOp: 45,
          score: 12,
          likeCount: 11,
        },
        {
          authorKey: "chelsea",
          content: "City outsider talk is lazy — never count them out.",
          minutesAfterOp: 90,
          score: -2,
          likeCount: 0,
        },
      ],
    },
    10: {
      opAuthorKey: "aek",
      op: "Μάχη σωτηρίας στη Super League — ποιος πηγαίνει κάτω;",
      replies: [
        {
          authorKey: "pao",
          content: "Ο Απόλλωνας Σμύρνης μου φαίνεται πιο ευάλωτος.",
          minutesAfterOp: 50,
          score: 2,
          likeCount: 2,
        },
        {
          authorKey: "neutral",
          content: "Όποιος χάσει το επόμενο ντέρμπι υποβιβασμού.",
          minutesAfterOp: 120,
          parentIndex: 1,
          score: 5,
          likeCount: 4,
        },
      ],
    },
  };

export function defaultThreadFixture(
  threadId: number,
  title: string,
): MockThreadPostsFixture {
  return {
    op: `Αρχικό post για το θέμα «${title}». Τι πιστεύετε;`,
    replies: [
      {
        authorKey: "neutral",
        content: "Συμφωνώ — καλή αρχή για συζήτηση.",
        minutesAfterOp: 15,
        score: 2,
        likeCount: 2,
      },
      {
        authorKey: "pao",
        content: "Θα ήθελα περισσότερες λεπτομέρειες.",
        minutesAfterOp: 30,
        parentIndex: 0,
        score: 1,
        likeCount: 1,
      },
    ],
  };
}
