const MESSAGES = {
  en: {
    privatePlayer: "Private Player",
    localMusicLibrary: "Local music library",
    likes: "Special Select",
    recent: "Recent Played",
    playlists: "My Lists",
    newPlaylist: "New Playlist",
    playlistNamePlaceholder: "Playlist name",
    create: "Create",
    sourceFolder: "Source Folder",
    openSourceFolder: "Open source folder",
    searchPlaceholder: "Search songs, artists, lyrics",
    rescan: "Rescan",
    offlineSave: "Save Offline",
    offlineSaving: "Saving...",
    offlineSaved: "Offline library saved.",
    offlineReady: "Offline ready",
    offlineUnsupported: "Offline install is not supported in this browser.",
    offlineNoSongs: "No songs available to save offline.",
    offlineProgress: "Saving offline",
    offlineStorageLow: "Phone storage quota may be too small for the whole library.",
    offlineFailed: "Offline save failed",
    collection: "Collection",
    playlist: "Playlist",
    recentLabel: "Recently Played",
    localSource: "Local source",
    collectionSubtitle: "All files in the local source folder are treated as your liked music.",
    recentSubtitle: "Songs you played recently appear here.",
    playlistSubtitle: "Custom list stored in the local player database.",
    ownerName: "Longchao's",
    synced: "Synced",
    playAll: "Play All",
    editSelected: "Edit Selected",
    immersive: "Immersive",
    songsTab: "Songs",
    editorTab: "Editor",
    lyricsTab: "Lyrics",
    ktvTab: "KTV",
    library: "Library",
    songQueue: "Song Queue",
    localLibrary: "Local library",
    historyView: "Playback history",
    playlistTracks: "Playlist tracks",
    index: "#",
    title: "Title",
    artist: "Artist",
    album: "Album",
    duration: "Duration",
    action: "Action",
    inspector: "Inspector",
    chooseSong: "Choose a song",
    displayName: "Display Name",
    fileName: "File Name",
    notes: "Info / Notes",
    lyrics: "Lyrics",
    saveSong: "Save Song",
    autoFetch: "Auto Fetch",
    autoFetchSearching: "Fetching...",
    fetchStagePrepare: "Waking the little dragon...",
    fetchStageCatalog: "Searching online catalogs...",
    fetchStageLyrics: "Matching synced lyrics...",
    fetchStagePreview: "Preparing preview...",
    fetchStageSaving: "Saving selected metadata...",
    saveFetched: "Save Fetched",
    abandonFetched: "Abandon",
    uploadCover: "Upload Cover",
    replaceCover: "Replace Cover",
    removeCover: "Remove Cover",
    addToList: "Add To List",
    includedIn: "Included In",
    noPlaylistMemberships: "Not in any playlists yet.",
    allPlaylistsAssigned: "Already in all playlists",
    preview: "Preview",
    emptyLyrics: "No lyrics yet. Save lyrics to preview them here.",
    nothingSelected: "Nothing selected",
    pickSong: "Pick a song from the library",
    unknownArtist: "Unknown artist",
    unsorted: "Unsorted",
    paused: "Paused",
    play: "Play",
    pause: "Pause",
    playing: "Playing",
    cancel: "Cancel",
    save: "Save",
    previous: "Previous",
    next: "Next",
    nowPlaying: "Now Playing",
    idle: "Idle",
    edit: "Edit",
    remove: "Remove",
    rename: "Rename",
    deletePlaylist: "Delete Playlist",
    playlistActions: "Playlist actions",
    noPlaylists: "No playlists yet",
    noPlaylistsHint: "Create a playlist to organize your favorite tracks.",
    noSongs: "No songs in this view yet.",
    noSongsMatch: "No songs match this view.",
    noSongsInPlaylistYet: "No songs in this playlist yet.",
    addSongsFromLibrary: "Add songs from your library.",
    format: "Format",
    immersivePlayback: "Immersive Playback",
    immersiveEmpty: "Lyrics will appear here after you save them.",
    selectedSong: "Selected Song",
    closeImmersive: "Close immersive view",
    closeKtvStage: "Close KTV stage",
    settingsSoon: "Settings panel can be added later.",
    queue: "Queue",
    queueMode: "Queue Play",
    shuffleMode: "Shuffle Play",
    repeatOneMode: "Repeat One",
    lyricsButton: "Lyrics",
    ktvMode: "KTV Mode",
    ktvScoring: "KTV Scoring",
    ktvPanelSubtitle: "Lyrics-gated singing workspace",
    ktvSelectSong: "Select a song for KTV.",
    ktvReady: "Ready",
    ktvBlocked: "Lyrics needed",
    ktvAutoLyrics: "Auto lyrics",
    ktvSyncedLyrics: "Synced lyrics",
    ktvPlainLyrics: "Plain lyrics",
    ktvLyricSource: "Lyric source",
    ktvUseDefaultLyrics: "Default lyrics",
    ktvUseExtractLyrics: "Extract",
    ktvPrepare: "Prepare stems",
    ktvExtractLyrics: "Extract lyrics",
    ktvReextractLyrics: "Re-extract",
    ktvPreparing: "Preparing",
    ktvPrepared: "Prepared",
    ktvPrepareFailed: "Prepare failed",
    ktvPrepareFirst: "Prepare stems before singing.",
    ktvAutoExtractFirst: "Extract lyrics and prepare stems before singing.",
    ktvAutoLyricsReady: "Use Prepare to extract lyrics from the original vocal and align the KTV guide.",
    ktvDefaultLyricsMissing: "Default lyrics are not complete for this song.",
    ktvAutoExtractUnavailable: "Automatic extraction requires the pretrained ASR model.",
    ktvStart: "Start singing",
    ktvStopScore: "Stop & preview",
    ktvRecording: "Recording",
    ktvUploadScoring: "Scoring recording",
    ktvLivePitch: "Live pitch",
    ktvPitchGuide: "Pitch guide",
    ktvPitchGuideMissing: "Prepare stems again to extract the pitch guide.",
    ktvPitchGuideLoading: "Loading pitch guide",
    ktvPitchGuideEmpty: "No stable source melody was detected yet.",
    ktvReferencePitch: "Guide",
    ktvVoicePitch: "Voice",
    ktvLevel: "Level",
    ktvNoPitch: "No pitch",
    ktvInTune: "In tune",
    ktvSharp: "Sharp",
    ktvFlat: "Flat",
    ktvPreview: "Recording preview",
    ktvUnsaved: "Unsaved",
    ktvSaveAs: "Save as",
    ktvSaveRecording: "Save & score",
    ktvDiscardRecording: "Discard",
    ktvRecordingReady: "Recording is ready to preview.",
    ktvRecordingDiscarded: "Recording discarded.",
    ktvStems: "Separated audio",
    ktvVocals: "Vocals",
    ktvAccompaniment: "Accompaniment",
    ktvBackground: "Background",
    ktvLatestResult: "Latest result",
    ktvNoResult: "No KTV result yet.",
    ktvScore: "Score",
    ktvTiming: "Timing",
    ktvEnergy: "Energy",
    ktvPitch: "Pitch",
    ktvLyricsScore: "Lyrics",
    ktvModel: "Model",
    ktvConfidence: "Confidence",
    ktvNeedsLyrics: "KTV requires complete lyrics first.",
    ktvMicUnavailable: "Microphone recording is not available in this browser.",
    ktvRecordingFailed: "Recording failed",
    ktvPreparingToast: "KTV preparation started.",
    ktvAutoPreparingToast: "KTV lyric extraction and stem preparation started.",
    ktvScoredToast: "KTV score is ready.",
    ktvTaskSubmitting: "Starting KTV task",
    ktvTaskSubmittingDetail: "Sending the request to the local model pipeline.",
    ktvTaskQueued: "Task queued",
    ktvTaskQueuedDetail: "The KTV pipeline is waiting for the model worker.",
    ktvTaskSeparating: "Separating vocals and accompaniment",
    ktvTaskSeparatingDetail: "Building the vocal stem and the backing track for singing.",
    ktvTaskAligning: "Aligning lyrics",
    ktvTaskAligningDetail: "Matching the lyric text to the original vocal timing.",
    ktvTaskExtracting: "Extracting lyrics with ASR",
    ktvTaskExtractingDetail: "The speech model is listening to the original vocal and aligning lines.",
    ktvTaskPitch: "Extracting the reference pitch line",
    ktvTaskPitchDetail: "Detecting the melody from the original vocal for the guide bars.",
    ktvTaskFinalizing: "Finalizing KTV guide",
    ktvTaskFinalizingDetail: "Saving extracted lyrics, stems, and pitch guide for this song.",
    ktvTaskLoadingGuide: "Loading pitch guide",
    ktvTaskLoadingGuideDetail: "The prepared melody data is being loaded into the stage.",
    ktvTaskReady: "Ready to sing",
    ktvTaskReadyDetail: "The backing track, lyrics, and pitch guide are ready.",
    ktvTaskNeedExtract: "Lyrics need extraction",
    ktvTaskNeedExtractDetail: "Choose Extract and click Extract lyrics to generate aligned lyrics.",
    ktvTaskNeedPrepare: "KTV guide not prepared",
    ktvTaskNeedPrepareDetail: "Prepare stems before starting the performance.",
    ktvTaskFailed: "KTV task failed",
    sourceSynced: "Source synced",
    songSaved: "Song details saved.",
    metadataFetched: "Online metadata updated.",
    metadataReady: "Review fetched metadata before saving.",
    metadataNotFound: "No online metadata found.",
    metadataAbandoned: "Fetched metadata abandoned.",
    coverUpdated: "Cover updated.",
    coverRemoved: "Cover removed.",
    playlistCreated: "Playlist created.",
    playlistRenamed: "Playlist renamed.",
    playlistDeleted: "Playlist deleted.",
    playlistNameRequired: "Playlist name cannot be empty.",
    selectPlaylist: "Select",
    selectPlaylistFirst: "Select a playlist first.",
    songAdded: "Song added to playlist.",
    songRemoved: "Song removed from playlist.",
    rescanned: "Source folder rescanned.",
    sourceFolderOpened: "Source folder opened.",
    noSongsAvailable: "No songs available in this view.",
    noMoreSongs: "No more songs in this direction.",
    chooseSongFirst: "Choose a song first.",
    createPlaylistFirst: "Create a playlist first.",
    currentSongGone: "Current song is no longer available.",
    playbackFailed: "Playback failed",
    closeEditor: "Close editor",
    playlistNameLabel: "Playlist name",
    renamePlaylistTitle: "Rename playlist",
    renamePlaylistCopy: "Update the playlist name. Songs in your library stay unchanged.",
    deletePlaylistTitle: "Delete this playlist?",
    deletePlaylistCopy: "This will remove the playlist only. Songs in your library will not be deleted.",
    sidebarResizeLabel: "Resize sidebar",
    trackUnit: "tracks",
  },
  zh: {
    privatePlayer: "私人播放器",
    localMusicLibrary: "本地音乐库",
    likes: "精选",
    recent: "最近播放",
    playlists: "我的歌单",
    newPlaylist: "新建歌单",
    playlistNamePlaceholder: "歌单名称",
    create: "创建",
    sourceFolder: "歌曲目录",
    openSourceFolder: "打开歌曲目录",
    searchPlaceholder: "搜索歌曲、歌手、歌词",
    rescan: "重新扫描",
    offlineSave: "离线保存",
    offlineSaving: "保存中",
    offlineSaved: "离线曲库已保存。",
    offlineReady: "已离线",
    offlineUnsupported: "当前浏览器不支持离线安装。",
    offlineNoSongs: "当前没有可离线保存的歌曲。",
    offlineProgress: "正在离线保存",
    offlineStorageLow: "手机可用缓存空间可能不足以保存整个曲库。",
    offlineFailed: "离线保存失败",
    collection: "收藏",
    playlist: "歌单",
    recentLabel: "最近播放",
    localSource: "本地来源",
    collectionSubtitle: "source 文件夹中的内容会直接作为你的喜欢音乐。",
    recentSubtitle: "你最近播放过的歌曲会出现在这里。",
    playlistSubtitle: "保存在本地播放器数据库中的自定义歌单。",
    ownerName: "Longchao's",
    synced: "已同步",
    playAll: "播放全部",
    editSelected: "编辑选中",
    immersive: "沉浸模式",
    songsTab: "歌曲",
    editorTab: "编辑",
    lyricsTab: "歌词",
    ktvTab: "KTV",
    library: "音乐库",
    songQueue: "歌曲列表",
    localLibrary: "本地库",
    historyView: "播放记录",
    playlistTracks: "歌单歌曲",
    index: "#",
    title: "标题",
    artist: "歌手",
    album: "专辑",
    duration: "时长",
    action: "操作",
    inspector: "编辑器",
    chooseSong: "选择歌曲",
    displayName: "显示名称",
    fileName: "文件名",
    notes: "信息 / 备注",
    lyrics: "歌词",
    saveSong: "保存歌曲",
    autoFetch: "自动获取",
    autoFetchSearching: "获取中...",
    fetchStagePrepare: "正在唤醒小红龙...",
    fetchStageCatalog: "正在搜索在线曲库...",
    fetchStageLyrics: "正在匹配同步歌词...",
    fetchStagePreview: "正在整理预览...",
    fetchStageSaving: "正在保存选择的信息...",
    saveFetched: "保存获取结果",
    abandonFetched: "放弃",
    uploadCover: "上传封面",
    replaceCover: "更换封面",
    removeCover: "删除封面",
    addToList: "加入歌单",
    includedIn: "收录歌单",
    noPlaylistMemberships: "还没有被收录进任何歌单。",
    allPlaylistsAssigned: "已加入所有歌单",
    preview: "预览",
    emptyLyrics: "还没有歌词，保存后会在这里预览。",
    nothingSelected: "未选择歌曲",
    pickSong: "从列表中选择一首歌",
    unknownArtist: "未知歌手",
    unsorted: "未分类",
    paused: "已暂停",
    play: "播放",
    pause: "暂停",
    playing: "播放中",
    cancel: "取消",
    save: "保存",
    previous: "上一首",
    next: "下一首",
    nowPlaying: "正在播放",
    idle: "空闲",
    edit: "编辑",
    remove: "移除",
    rename: "重命名",
    deletePlaylist: "删除歌单",
    playlistActions: "歌单操作",
    noPlaylists: "还没有歌单",
    noPlaylistsHint: "创建一个歌单来整理你喜欢的音乐。",
    noSongs: "这个视图里还没有歌曲。",
    noSongsMatch: "当前视图没有匹配结果。",
    noSongsInPlaylistYet: "这个歌单里还没有歌曲。",
    addSongsFromLibrary: "从你的音乐库添加歌曲。",
    format: "格式",
    immersivePlayback: "沉浸播放",
    immersiveEmpty: "保存歌词后会显示在这里。",
    selectedSong: "已选歌曲",
    closeImmersive: "关闭沉浸模式",
    closeKtvStage: "关闭 KTV 舞台",
    settingsSoon: "设置面板可以后续再做。",
    queue: "队列",
    queueMode: "顺序播放",
    shuffleMode: "随机播放",
    repeatOneMode: "单曲循环",
    lyricsButton: "歌词",
    ktvMode: "KTV 模式",
    ktvScoring: "KTV 评分",
    ktvPanelSubtitle: "只允许完整歌词歌曲进入",
    ktvSelectSong: "请选择一首歌进行 KTV。",
    ktvReady: "可演唱",
    ktvBlocked: "需要歌词",
    ktvAutoLyrics: "可自动提词",
    ktvSyncedLyrics: "同步歌词",
    ktvPlainLyrics: "完整歌词",
    ktvLyricSource: "歌词来源",
    ktvUseDefaultLyrics: "默认歌词",
    ktvUseExtractLyrics: "自动提取",
    ktvPrepare: "准备分轨",
    ktvExtractLyrics: "提取歌词",
    ktvReextractLyrics: "重新提取",
    ktvPreparing: "准备中",
    ktvPrepared: "已准备",
    ktvPrepareFailed: "准备失败",
    ktvPrepareFirst: "请先准备分轨再演唱。",
    ktvAutoExtractFirst: "请先自动提取歌词并准备分轨。",
    ktvAutoLyricsReady: "点击准备，将从原唱人声自动提取歌词并对齐 KTV 音高线。",
    ktvDefaultLyricsMissing: "这首歌的默认歌词还不完整。",
    ktvAutoExtractUnavailable: "自动提取需要 pretrained ASR 模型。",
    ktvStart: "开始演唱",
    ktvStopScore: "结束并试听",
    ktvRecording: "录音中",
    ktvUploadScoring: "正在评分",
    ktvLivePitch: "实时音高",
    ktvPitchGuide: "音高线",
    ktvPitchGuideMissing: "请重新准备分轨以提取音高线。",
    ktvPitchGuideLoading: "正在加载音高线",
    ktvPitchGuideEmpty: "暂未检测到稳定的原唱旋律线。",
    ktvReferencePitch: "音准提示线",
    ktvVoicePitch: "人声音高线",
    ktvLevel: "音量",
    ktvNoPitch: "未检测到音高",
    ktvInTune: "音准接近",
    ktvSharp: "偏高",
    ktvFlat: "偏低",
    ktvPreview: "录音试听",
    ktvUnsaved: "未保存",
    ktvSaveAs: "保存为",
    ktvSaveRecording: "保存并评分",
    ktvDiscardRecording: "丢弃",
    ktvRecordingReady: "录音已可试听。",
    ktvRecordingDiscarded: "录音已丢弃。",
    ktvStems: "分离音轨",
    ktvVocals: "人声",
    ktvAccompaniment: "伴奏",
    ktvBackground: "背景",
    ktvLatestResult: "最新结果",
    ktvNoResult: "还没有 KTV 结果。",
    ktvScore: "总分",
    ktvTiming: "节奏",
    ktvEnergy: "音量",
    ktvPitch: "音高",
    ktvLyricsScore: "歌词",
    ktvModel: "模型",
    ktvConfidence: "置信度",
    ktvNeedsLyrics: "KTV 需要先补全歌词。",
    ktvMicUnavailable: "当前浏览器不能录音。",
    ktvRecordingFailed: "录音失败",
    ktvPreparingToast: "KTV 分轨任务已开始。",
    ktvAutoPreparingToast: "KTV 歌词提取和分轨任务已开始。",
    ktvScoredToast: "KTV 评分完成。",
    ktvTaskSubmitting: "正在启动 KTV 任务",
    ktvTaskSubmittingDetail: "正在把请求发送给本地模型管线。",
    ktvTaskQueued: "任务已排队",
    ktvTaskQueuedDetail: "正在等待模型工作进程接手。",
    ktvTaskSeparating: "正在分离人声和伴奏",
    ktvTaskSeparatingDetail: "正在生成原唱人声、伴奏和背景音轨。",
    ktvTaskAligning: "正在对齐歌词",
    ktvTaskAligningDetail: "正在把歌词文本匹配到原唱人声时间轴。",
    ktvTaskExtracting: "正在用 ASR 提取歌词",
    ktvTaskExtractingDetail: "语音模型正在识别原唱人声，并自动对齐每一句。",
    ktvTaskPitch: "正在提取标准音高线",
    ktvTaskPitchDetail: "正在从原唱人声中检测旋律，生成音准提示条。",
    ktvTaskFinalizing: "正在生成 KTV 指南",
    ktvTaskFinalizingDetail: "正在保存提取歌词、分轨和音高线。",
    ktvTaskLoadingGuide: "正在加载音高线",
    ktvTaskLoadingGuideDetail: "已完成准备，正在把旋律数据加载到舞台。",
    ktvTaskReady: "可以开始演唱",
    ktvTaskReadyDetail: "伴奏、歌词和音高线都已准备好。",
    ktvTaskNeedExtract: "需要提取歌词",
    ktvTaskNeedExtractDetail: "选择自动提取后，点击“提取歌词”生成对齐歌词。",
    ktvTaskNeedPrepare: "还没有准备 KTV 指南",
    ktvTaskNeedPrepareDetail: "请先准备分轨，再开始演唱。",
    ktvTaskFailed: "KTV 任务失败",
    sourceSynced: "source 已同步",
    songSaved: "歌曲信息已保存。",
    metadataFetched: "已更新在线歌曲信息。",
    metadataReady: "请检查获取到的信息，再决定是否保存。",
    metadataNotFound: "没有找到在线歌曲信息。",
    metadataAbandoned: "已放弃获取到的信息。",
    coverUpdated: "封面已更新。",
    coverRemoved: "封面已删除。",
    playlistCreated: "歌单已创建。",
    playlistRenamed: "歌单已重命名。",
    playlistDeleted: "歌单已删除。",
    playlistNameRequired: "歌单名称不能为空。",
    selectPlaylist: "选择歌单",
    selectPlaylistFirst: "请先选择歌单。",
    songAdded: "已加入歌单。",
    songRemoved: "已从歌单移除。",
    rescanned: "已重新扫描 source 文件夹。",
    sourceFolderOpened: "已打开歌曲目录。",
    noSongsAvailable: "当前视图没有可播放歌曲。",
    noMoreSongs: "这个方向没有更多歌曲。",
    chooseSongFirst: "请先选择一首歌。",
    createPlaylistFirst: "请先创建歌单。",
    currentSongGone: "当前播放歌曲已不存在。",
    playbackFailed: "播放失败",
    closeEditor: "关闭编辑器",
    playlistNameLabel: "歌单名称",
    renamePlaylistTitle: "重命名歌单",
    renamePlaylistCopy: "只会更新歌单名称，不会影响音乐库中的歌曲。",
    deletePlaylistTitle: "删除这个歌单？",
    deletePlaylistCopy: "只会删除歌单本身，不会删除音乐文件或本地音乐库中的歌曲。",
    sidebarResizeLabel: "调整侧边栏宽度",
    trackUnit: "首",
  },
};

const SIDEBAR_MIN_WIDTH = 240;
const SIDEBAR_MAX_WIDTH = 420;
const SIDEBAR_DEFAULT_WIDTH = 308;

const state = {
  libraryPath: "",
  songs: [],
  recentSongIds: [],
  playlists: [],
  activeView: { type: "likes", playlistId: null },
  selectedSongId: null,
  currentSongId: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  search: "",
  playlistsExpanded: true,
  playlistFormOpen: false,
  editorOpen: false,
  language: loadStoredLanguage(),
  immersiveOpen: false,
  durationCache: {},
  sidebarWidth: loadStoredSidebarWidth(),
  playlistMenu: { open: false, playlistId: null, x: 0, y: 0 },
  playlistDialog: { open: false, mode: null, playlistId: null },
  isSidebarResizing: false,
  playbackMode: "queue",
  shuffleOrder: [],
  shuffleQueueKey: "",
  shuffleIndex: -1,
  playlistDraftSelectionBySongId: {},
  metadataPreview: null,
  offline: {
    supported: false,
    saving: false,
    cachedCount: 0,
    cachedBytes: 0,
    lastSavedAt: "",
    progressDone: 0,
    progressTotal: 0,
  },
  ktvLyricModeBySongId: {},
  ktv: {
    assetsBySongId: {},
    latestSessionsBySongId: {},
    sessions: [],
    config: {},
  },
  ktvOpen: false,
  ktvRecording: null,
  ktvDraftRecording: null,
  ktvUiTask: null,
  ktvCountdown: {
    active: false,
    step: 0,
  },
  ktvPitchGuidesBySongId: {},
  ktvPitchHistory: [],
  ktvPitch: {
    active: false,
    level: 0,
    frequency: 0,
    referenceFrequency: 0,
    note: "",
    cents: 0,
    status: "",
  },
};

const durationProbeQueue = [];
const durationProbeIds = new Set();
let durationProbeActive = 0;
let toastTimer = null;
let blockingLoaderTimer = null;
let blockingLoaderStageIndex = 0;
let ktvPollTimer = null;
let ktvPitchAnimationFrame = null;
const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

const elements = {
  appShell: document.querySelector("#app-shell"),
  navItems: [...document.querySelectorAll(".sidebar-item[data-view]")],
  playlistToggle: document.querySelector("#playlist-toggle"),
  playlistToggleIcon: document.querySelector("#playlist-toggle-icon"),
  playlistCreateToggle: document.querySelector("#playlist-create-toggle"),
  playlistHeading: document.querySelector("#playlist-heading"),
  playlistCreateWrap: document.querySelector("#playlist-create-wrap"),
  playlistForm: document.querySelector("#playlist-form"),
  playlistNameInput: document.querySelector("#playlist-name-input"),
  playlistSubmitButton: document.querySelector("#playlist-submit-button"),
  playlistCancelButton: document.querySelector("#playlist-cancel-button"),
  playlistList: document.querySelector("#playlist-list"),
  openSourceFolderButton: document.querySelector("#open-source-folder-button"),
  sourcePathLabel: document.querySelector("#source-path-label"),
  sourcePath: document.querySelector("#source-path"),
  sidebarResizer: document.querySelector("#sidebar-resizer"),
  profileAvatar: document.querySelector(".profile-avatar"),
  profileName: document.querySelector("#profile-name"),
  profileSubtitle: document.querySelector("#profile-subtitle"),
  brandKicker: document.querySelector("#brand-kicker"),
  likesLabel: document.querySelector("#likes-label"),
  recentLabel: document.querySelector("#recent-label"),
  likesCount: document.querySelector("#likes-count"),
  recentCount: document.querySelector("#recent-count"),
  backButton: document.querySelector("#back-button"),
  forwardButton: document.querySelector("#forward-button"),
  searchInput: document.querySelector("#search-input"),
  languageButtons: [...document.querySelectorAll(".language-option")],
  refreshButton: document.querySelector("#refresh-button"),
  refreshButtonLabel: document.querySelector("#refresh-button-label"),
  offlineSaveButton: document.querySelector("#offline-save-button"),
  offlineSaveButtonLabel: document.querySelector("#offline-save-button-label"),
  settingsButton: document.querySelector("#settings-button"),
  heroLabel: document.querySelector("#hero-label"),
  heroSourceNote: document.querySelector("#hero-source-note"),
  heroTitle: document.querySelector("#hero-title"),
  heroSubtitle: document.querySelector("#hero-subtitle"),
  heroMetaLine: document.querySelector("#hero-meta-line"),
  heroTrackCount: document.querySelector("#hero-track-count"),
  heroDuration: document.querySelector("#hero-duration"),
  heroNowPlaying: document.querySelector("#hero-now-playing"),
  heroPlay: document.querySelector("#hero-play"),
  heroPlayLabel: document.querySelector("#hero-play-label"),
  focusEditorButton: document.querySelector("#focus-editor-button"),
  focusEditorLabel: document.querySelector("#focus-editor-label"),
  openImmersiveButton: document.querySelector("#open-immersive-button"),
  openImmersiveLabel: document.querySelector("#open-immersive-label"),
  headerCoverImage: document.querySelector("#header-cover-image"),
  headerCoverPlaceholder: document.querySelector("#header-cover-placeholder"),
  tabSongs: document.querySelector("#tab-songs"),
  tabEditor: document.querySelector("#tab-editor"),
  tabLyrics: document.querySelector("#tab-lyrics"),
  tabKtv: document.querySelector("#tab-ktv"),
  songPanelKicker: document.querySelector("#song-panel-kicker"),
  songPanelTitle: document.querySelector("#song-panel-title"),
  songPanelSummary: document.querySelector("#song-panel-summary"),
  colIndex: document.querySelector("#col-index"),
  colTitle: document.querySelector("#col-title"),
  colArtist: document.querySelector("#col-artist"),
  colAlbum: document.querySelector("#col-album"),
  colDuration: document.querySelector("#col-duration"),
  colAction: document.querySelector("#col-action"),
  songTableBody: document.querySelector("#song-table-body"),
  ktvPanel: document.querySelector("#ktv-panel"),
  ktvPanelKicker: document.querySelector("#ktv-panel-kicker"),
  ktvPanelTitle: document.querySelector("#ktv-panel-title"),
  ktvReadinessPill: document.querySelector("#ktv-readiness-pill"),
  ktvStageClose: document.querySelector("#ktv-stage-close"),
  ktvStageScore: document.querySelector("#ktv-stage-score"),
  ktvStageScoreFill: document.querySelector("#ktv-stage-score-fill"),
  ktvSelectedKicker: document.querySelector("#ktv-selected-kicker"),
  ktvSelectedTitle: document.querySelector("#ktv-selected-title"),
  ktvSelectedMeta: document.querySelector("#ktv-selected-meta"),
  ktvStatusLine: document.querySelector("#ktv-status-line"),
  ktvTaskStatus: document.querySelector("#ktv-task-status"),
  ktvTaskTitle: document.querySelector("#ktv-task-title"),
  ktvTaskDetail: document.querySelector("#ktv-task-detail"),
  ktvTaskProgressFill: document.querySelector("#ktv-task-progress-fill"),
  ktvLyricModeDefaultButton: document.querySelector("#ktv-lyric-mode-default"),
  ktvLyricModeExtractButton: document.querySelector("#ktv-lyric-mode-extract"),
  ktvPrepareButton: document.querySelector("#ktv-prepare-button"),
  ktvRecordButton: document.querySelector("#ktv-record-button"),
  ktvStopButton: document.querySelector("#ktv-stop-button"),
  ktvMonitorTitle: document.querySelector("#ktv-monitor-title"),
  ktvNoteLabel: document.querySelector("#ktv-note-label"),
  ktvPitchGuide: document.querySelector("#ktv-pitch-guide"),
  ktvReferencePitchLayer: document.querySelector("#ktv-reference-pitch-layer"),
  ktvLivePitchLayer: document.querySelector("#ktv-live-pitch-layer"),
  ktvPitchGuideSvg: document.querySelector("#ktv-pitch-guide-svg"),
  ktvPitchActiveWindow: document.querySelector("#ktv-pitch-active-window"),
  ktvReferencePitchBars: document.querySelector("#ktv-reference-pitch-bars"),
  ktvLivePitchBars: document.querySelector("#ktv-live-pitch-bars"),
  ktvNoteParticles: document.querySelector("#ktv-note-particles"),
  ktvReferencePitchPath: document.querySelector("#ktv-reference-pitch-path"),
  ktvLivePitchPath: document.querySelector("#ktv-live-pitch-path"),
  ktvPitchPlayheadGlow: document.querySelector("#ktv-pitch-playhead-glow"),
  ktvPitchPlayhead: document.querySelector("#ktv-pitch-playhead"),
  ktvCountdown: document.querySelector("#ktv-countdown"),
  ktvPitchGuideEmpty: document.querySelector("#ktv-pitch-guide-empty"),
  ktvPitchMarker: document.querySelector("#ktv-pitch-marker"),
  ktvLevelLabel: document.querySelector("#ktv-level-label"),
  ktvLevelMeter: document.querySelector("#ktv-level-meter"),
  ktvLevelValue: document.querySelector("#ktv-level-value"),
  ktvLyricsHeading: document.querySelector("#ktv-lyrics-heading"),
  ktvStageProgressLabel: document.querySelector("#ktv-stage-progress-label"),
  ktvLyrics: document.querySelector("#ktv-lyrics"),
  ktvPreviewPanel: document.querySelector("#ktv-preview-panel"),
  ktvPreviewTitle: document.querySelector("#ktv-preview-title"),
  ktvPreviewStatus: document.querySelector("#ktv-preview-status"),
  ktvPreviewAudio: document.querySelector("#ktv-preview-audio"),
  ktvSaveNameLabel: document.querySelector("#ktv-save-name-label"),
  ktvSaveNameInput: document.querySelector("#ktv-save-name-input"),
  ktvSaveRecordingButton: document.querySelector("#ktv-save-recording-button"),
  ktvDiscardRecordingButton: document.querySelector("#ktv-discard-recording-button"),
  ktvStemsTitle: document.querySelector("#ktv-stems-title"),
  ktvModelLabel: document.querySelector("#ktv-model-label"),
  ktvStemLinks: document.querySelector("#ktv-stem-links"),
  ktvResultTitle: document.querySelector("#ktv-result-title"),
  ktvConfidenceLabel: document.querySelector("#ktv-confidence-label"),
  ktvScoreBody: document.querySelector("#ktv-score-body"),
  editorScrim: document.querySelector("#editor-scrim"),
  editorPanel: document.querySelector("#editor-panel"),
  editorPanelKicker: document.querySelector("#editor-panel-kicker"),
  editorClose: document.querySelector("#editor-close"),
  detailTitle: document.querySelector("#detail-title"),
  detailBadge: document.querySelector("#detail-badge"),
  coverImage: document.querySelector("#cover-image"),
  coverPlaceholder: document.querySelector("#cover-placeholder"),
  songForm: document.querySelector("#song-form"),
  displayTitleInput: document.querySelector("#display-title-input"),
  fileStemInput: document.querySelector("#file-stem-input"),
  fileExtensionLabel: document.querySelector("#file-extension-label"),
  artistInput: document.querySelector("#artist-input"),
  albumInput: document.querySelector("#album-input"),
  notesInput: document.querySelector("#notes-input"),
  lyricsInput: document.querySelector("#lyrics-input"),
  labelDisplayTitle: document.querySelector("#label-display-title"),
  labelFileStem: document.querySelector("#label-file-stem"),
  labelArtist: document.querySelector("#label-artist"),
  labelAlbum: document.querySelector("#label-album"),
  labelNotes: document.querySelector("#label-notes"),
  labelLyrics: document.querySelector("#label-lyrics"),
  playlistMembershipLabel: document.querySelector("#playlist-membership-label"),
  playlistMembershipList: document.querySelector("#playlist-membership-list"),
  saveSongLabel: document.querySelector("#save-song-label"),
  autoFetchMetadataButton: document.querySelector("#auto-fetch-metadata-button"),
  metadataReview: document.querySelector("#metadata-review"),
  metadataReviewText: document.querySelector("#metadata-review-text"),
  saveFetchedMetadataButton: document.querySelector("#save-fetched-metadata-button"),
  abandonFetchedMetadataButton: document.querySelector("#abandon-fetched-metadata-button"),
  uploadCoverButton: document.querySelector("#upload-cover-button"),
  removeCoverButton: document.querySelector("#remove-cover-button"),
  playlistSelect: document.querySelector("#playlist-select"),
  addToPlaylistButton: document.querySelector("#add-to-playlist-button"),
  lyricsPreviewKicker: document.querySelector("#lyrics-preview-kicker"),
  lyricsPreviewTitle: document.querySelector("#lyrics-preview-title"),
  lyricsPreview: document.querySelector("#lyrics-preview"),
  lyricsPreviewPanel: document.querySelector("#lyrics-preview-panel"),
  playerTitle: document.querySelector("#player-title"),
  playerSubtitle: document.querySelector("#player-subtitle"),
  miniCover: document.querySelector("#mini-cover"),
  miniCoverButton: document.querySelector("#mini-cover-button"),
  prevButton: document.querySelector("#prev-button"),
  playButton: document.querySelector("#play-button"),
  playButtonIcon: document.querySelector("#play-button-icon"),
  nextButton: document.querySelector("#next-button"),
  progressInput: document.querySelector("#progress-input"),
  currentTimeLabel: document.querySelector("#current-time-label"),
  durationLabel: document.querySelector("#duration-label"),
  playerLyricsButton: document.querySelector("#player-lyrics-button"),
  playerQueueButton: document.querySelector("#player-queue-button"),
  playerModeIcon: document.querySelector("#player-mode-icon"),
  playerImmersiveButton: document.querySelector("#player-immersive-button"),
  playerStatusLabel: document.querySelector("#player-status-label"),
  immersiveOverlay: document.querySelector("#immersive-overlay"),
  immersiveClose: document.querySelector("#immersive-close"),
  immersiveKicker: document.querySelector("#immersive-kicker"),
  immersiveDisc: document.querySelector("#immersive-disc"),
  immersiveCoverImage: document.querySelector("#immersive-cover-image"),
  immersiveCoverPlaceholder: document.querySelector("#immersive-cover-placeholder"),
  immersiveEditButton: document.querySelector("#immersive-edit-button"),
  immersiveAutoFetchButton: document.querySelector("#immersive-auto-fetch-button"),
  immersiveUploadButton: document.querySelector("#immersive-upload-button"),
  immersiveTypeLabel: document.querySelector("#immersive-type-label"),
  immersiveTitle: document.querySelector("#immersive-title"),
  immersiveSubtitle: document.querySelector("#immersive-subtitle"),
  immersiveMetadataReview: document.querySelector("#immersive-metadata-review"),
  immersiveMetadataReviewText: document.querySelector("#immersive-metadata-review-text"),
  immersiveSaveFetchedButton: document.querySelector("#immersive-save-fetched-button"),
  immersiveAbandonFetchedButton: document.querySelector("#immersive-abandon-fetched-button"),
  immersiveArtistLabel: document.querySelector("#immersive-artist-label"),
  immersiveAlbumLabel: document.querySelector("#immersive-album-label"),
  immersiveSourceLabel: document.querySelector("#immersive-source-label"),
  immersiveArtist: document.querySelector("#immersive-artist"),
  immersiveAlbum: document.querySelector("#immersive-album"),
  immersiveSource: document.querySelector("#immersive-source"),
  immersiveLyricsHeading: document.querySelector("#immersive-lyrics-heading"),
  immersiveProgressLabel: document.querySelector("#immersive-progress-label"),
  immersiveLyrics: document.querySelector("#immersive-lyrics"),
  coverUploadInput: document.querySelector("#cover-upload-input"),
  mediaElement: document.querySelector("#media-element"),
  toast: document.querySelector("#toast"),
  blockingLoader: document.querySelector("#blocking-loader"),
  blockingLoaderText: document.querySelector("#blocking-loader-text"),
  playlistMenu: document.querySelector("#playlist-menu"),
  playlistMenuRename: document.querySelector("#playlist-menu-rename"),
  playlistMenuDelete: document.querySelector("#playlist-menu-delete"),
  playlistDialog: document.querySelector("#playlist-dialog"),
  playlistDialogTitle: document.querySelector("#playlist-dialog-title"),
  playlistDialogCopy: document.querySelector("#playlist-dialog-copy"),
  playlistDialogField: document.querySelector("#playlist-dialog-field"),
  playlistDialogFieldLabel: document.querySelector("#playlist-dialog-field-label"),
  playlistDialogInput: document.querySelector("#playlist-dialog-input"),
  playlistDialogCancel: document.querySelector("#playlist-dialog-cancel"),
  playlistDialogConfirm: document.querySelector("#playlist-dialog-confirm"),
};

window.addEventListener("DOMContentLoaded", init);

async function init() {
  bindEvents();
  setupMediaSessionControls();
  await setupOfflineSupport();
  renderStaticCopy();
  await loadState({ preserveSelection: false });
  await refreshOfflineCacheStatus();
}

function bindEvents() {
  for (const navItem of elements.navItems) {
    navItem.addEventListener("click", () => {
      setActiveView({ type: navItem.dataset.view, playlistId: null });
    });
  }

  for (const button of elements.languageButtons) {
    button.addEventListener("click", () => {
      setLanguage(button.dataset.language);
    });
  }

  elements.playlistToggle.addEventListener("click", () => {
    state.playlistsExpanded = !state.playlistsExpanded;
    if (!state.playlistsExpanded) {
      closePlaylistCreationRow();
    }
    closePlaylistMenu();
    renderSidebar();
  });

  elements.playlistCreateToggle.addEventListener("click", () => {
    state.playlistsExpanded = true;
    state.playlistFormOpen = !state.playlistFormOpen;
    closePlaylistMenu();
    renderSidebar();

    if (state.playlistFormOpen) {
      queueMicrotask(() => elements.playlistNameInput.focus());
    }
  });

  elements.playlistForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const name = elements.playlistNameInput.value.trim();

    if (!name) {
      showToast(t("playlistNameRequired"));
      return;
    }

    try {
      const nextState = await fetchJson("/api/playlists", {
        method: "POST",
        body: JSON.stringify({ name }),
      });
      closePlaylistCreationRow();
      applyState(nextState);
      showToast(t("playlistCreated"));
    } catch (error) {
      showToast(error.message);
    }
  });

  elements.playlistCancelButton.addEventListener("click", () => {
    closePlaylistCreationRow();
    renderSidebar();
  });

  elements.playlistNameInput.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closePlaylistCreationRow();
      renderSidebar();
    }
  });

  elements.playlistList.addEventListener("click", (event) => {
    const actionButton = event.target.closest("[data-playlist-action]");
    if (actionButton) {
      const playlistId = Number(actionButton.dataset.playlistId);
      if (state.playlistMenu.open && state.playlistMenu.playlistId === playlistId) {
        closePlaylistMenu();
        return;
      }

      const rect = actionButton.getBoundingClientRect();
      openPlaylistMenu(playlistId, {
        x: rect.right - 12,
        y: rect.bottom + 6,
      });
      return;
    }

    const button = event.target.closest(".playlist-item[data-playlist-id]");
    if (!button) {
      return;
    }

    setActiveView({ type: "playlist", playlistId: Number(button.dataset.playlistId) });
  });

  elements.playlistList.addEventListener("contextmenu", (event) => {
    const row = event.target.closest(".playlist-row[data-playlist-id]");
    if (!row) {
      return;
    }

    event.preventDefault();
    openPlaylistMenu(Number(row.dataset.playlistId), {
      x: event.clientX,
      y: event.clientY,
    });
  });

  elements.playlistMenuRename.addEventListener("click", () => {
    const playlist = getPlaylistById(state.playlistMenu.playlistId);
    if (!playlist) {
      closePlaylistMenu();
      return;
    }

    openPlaylistDialog("rename", playlist.id);
  });

  elements.playlistMenuDelete.addEventListener("click", () => {
    const playlist = getPlaylistById(state.playlistMenu.playlistId);
    if (!playlist) {
      closePlaylistMenu();
      return;
    }

    openPlaylistDialog("delete", playlist.id);
  });

  elements.playlistDialogCancel.addEventListener("click", () => {
    closePlaylistDialog();
  });

  elements.playlistDialog.addEventListener("click", (event) => {
    if (event.target === elements.playlistDialog || event.target.classList.contains("dialog-scrim")) {
      closePlaylistDialog();
    }
  });

  elements.playlistDialogInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      submitPlaylistDialog();
      return;
    }

    if (event.key === "Escape") {
      closePlaylistDialog();
    }
  });

  elements.playlistDialogConfirm.addEventListener("click", () => {
    submitPlaylistDialog();
  });

  document.addEventListener("pointerdown", (event) => {
    if (!event.target.closest("#playlist-menu") && !event.target.closest("[data-playlist-action]")) {
      closePlaylistMenu();
    }
  });

  window.addEventListener("resize", () => {
    closePlaylistMenu();
  });

  document.addEventListener(
    "scroll",
    () => {
      closePlaylistMenu();
    },
    true,
  );

  elements.backButton.addEventListener("click", () => window.history.back());
  elements.forwardButton.addEventListener("click", () => window.history.forward());
  elements.settingsButton.addEventListener("click", () => showToast(t("settingsSoon")));
  elements.openSourceFolderButton.addEventListener("click", async () => {
    try {
      await fetchJson("/api/source-folder/open", { method: "POST" });
      showToast(t("sourceFolderOpened"));
    } catch (error) {
      showToast(error.message);
    }
  });

  elements.searchInput.addEventListener("input", () => {
    state.search = elements.searchInput.value;
    renderHeader();
    renderSongPanel();
  });

  elements.refreshButton.addEventListener("click", async () => {
    try {
      const nextState = await fetchJson("/api/library/refresh", { method: "POST" });
      applyState(nextState);
      showToast(t("rescanned"));
    } catch (error) {
      showToast(error.message);
    }
  });

  elements.offlineSaveButton?.addEventListener("click", () => {
    saveLibraryForOffline();
  });

  elements.heroPlay.addEventListener("click", async () => {
    const firstSong = getVisibleSongs()[0];
    if (!firstSong) {
      showToast(t("noSongsAvailable"));
      return;
    }

    await playSong(firstSong.id);
  });

  elements.focusEditorButton.addEventListener("click", () => {
    focusEditorPanel();
  });

  elements.openImmersiveButton.addEventListener("click", () => {
    openImmersive();
  });

  elements.tabSongs.addEventListener("click", () => {
    focusSongTable();
  });

  elements.tabEditor.addEventListener("click", () => {
    focusEditorPanel();
  });

  elements.tabLyrics.addEventListener("click", () => {
    focusLyricsPanel();
  });

  elements.songTableBody.addEventListener("click", async (event) => {
    const emptyAction = event.target.closest("[data-empty-action]");
    if (emptyAction?.dataset.emptyAction === "browse-library") {
      setActiveView({ type: "likes", playlistId: null });
      return;
    }

    const actionButton = event.target.closest("[data-action]");

    if (actionButton) {
      const songId = Number(actionButton.dataset.songId);
      const action = actionButton.dataset.action;

      if (action === "toggle-play") {
        const isCurrent = state.currentSongId === songId;
        if (isCurrent && state.isPlaying) {
          pausePlayback();
        } else {
          await playSong(songId);
        }
        return;
      }

      if (action === "open-editor") {
        state.selectedSongId = songId;
        renderHeader();
        renderSongPanel();
        openEditorPanel();
        return;
      }

      if (action === "open-ktv") {
        state.selectedSongId = songId;
        focusKtvPanel();
        return;
      }

      if (action === "remove-from-playlist" && state.activeView.type === "playlist") {
        try {
          const nextState = await fetchJson(
            `/api/playlists/${state.activeView.playlistId}/songs/${songId}`,
            { method: "DELETE" },
          );
          applyState(nextState);
          showToast(t("songRemoved"));
        } catch (error) {
          showToast(error.message);
        }
      }

      return;
    }

    const row = event.target.closest("tr[data-song-id]");
    if (!row) {
      return;
    }

    state.selectedSongId = Number(row.dataset.songId);
    renderHeader();
    syncSongTableSelection();
    renderKtvPanel();
    if (state.editorOpen) {
      renderEditorPanel();
    }
  });

  elements.songTableBody.addEventListener("dblclick", async (event) => {
    if (event.target.closest("[data-action]")) {
      return;
    }

    const row = event.target.closest("tr[data-song-id]");
    if (!row) {
      return;
    }

    await playSong(Number(row.dataset.songId));
  });

  elements.songForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const selectedSong = getSelectedSong();

    if (!selectedSong) {
      showToast(t("chooseSongFirst"));
      return;
    }

    const payload = {
      displayTitle: elements.displayTitleInput.value,
      fileStem: elements.fileStemInput.value,
      artist: elements.artistInput.value,
      album: elements.albumInput.value,
      notes: elements.notesInput.value,
      lyrics: elements.lyricsInput.value,
    };

    try {
      const nextState = await fetchJson(`/api/songs/${selectedSong.id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
      state.metadataPreview = null;
      applyState(nextState);
      showToast(t("songSaved"));
    } catch (error) {
      showToast(error.message);
    }
  });

  elements.autoFetchMetadataButton.addEventListener("click", () => {
    const selectedSong = getSelectedSong();
    if (!selectedSong) {
      showToast(t("chooseSongFirst"));
      return;
    }

    previewSongMetadata(selectedSong.id, "editor");
  });

  elements.saveFetchedMetadataButton.addEventListener("click", () => {
    saveFetchedMetadata();
  });

  elements.abandonFetchedMetadataButton.addEventListener("click", () => {
    abandonFetchedMetadata();
  });

  elements.uploadCoverButton.addEventListener("click", () => {
    if (!getSelectedSong()) {
      showToast(t("chooseSongFirst"));
      return;
    }

    elements.coverUploadInput.click();
  });

  elements.immersiveUploadButton.addEventListener("click", () => {
    if (!getSelectedSong()) {
      showToast(t("chooseSongFirst"));
      return;
    }

    elements.coverUploadInput.click();
  });

  elements.immersiveAutoFetchButton.addEventListener("click", () => {
    const song = getCurrentSong() || getSelectedSong();
    if (!song) {
      showToast(t("chooseSongFirst"));
      return;
    }

    state.selectedSongId = song.id;
    previewSongMetadata(song.id, "immersive");
  });

  elements.immersiveSaveFetchedButton.addEventListener("click", () => {
    saveFetchedMetadata();
  });

  elements.immersiveAbandonFetchedButton.addEventListener("click", () => {
    abandonFetchedMetadata();
  });

  elements.coverUploadInput.addEventListener("change", async () => {
    const selectedSong = getSelectedSong();
    const file = elements.coverUploadInput.files[0];

    if (!selectedSong || !file) {
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      const nextState = await fetchJson(`/api/songs/${selectedSong.id}/cover`, {
        method: "PUT",
        body: JSON.stringify({ dataUrl, fileName: file.name }),
      });
      applyState(nextState);
      showToast(t("coverUpdated"));
    } catch (error) {
      showToast(error.message);
    } finally {
      elements.coverUploadInput.value = "";
    }
  });

  elements.removeCoverButton.addEventListener("click", async () => {
    const selectedSong = getSelectedSong();

    if (!selectedSong) {
      showToast(t("chooseSongFirst"));
      return;
    }

    try {
      const nextState = await fetchJson(`/api/songs/${selectedSong.id}/cover`, {
        method: "DELETE",
      });
      applyState(nextState);
      showToast(t("coverRemoved"));
    } catch (error) {
      showToast(error.message);
    }
  });

  elements.playlistMembershipList.addEventListener("click", async (event) => {
    const removeButton = event.target.closest("[data-remove-playlist-id]");
    if (!removeButton) {
      return;
    }

    const selectedSong = getSelectedSong();
    const playlistId = Number(removeButton.dataset.removePlaylistId);

    if (!selectedSong) {
      showToast(t("chooseSongFirst"));
      return;
    }

    try {
      const nextState = await fetchJson(`/api/playlists/${playlistId}/songs/${selectedSong.id}`, {
        method: "DELETE",
      });
      applyState(nextState);
      showToast(t("songRemoved"));
    } catch (error) {
      showToast(error.message);
    }
  });

  elements.playlistSelect.addEventListener("change", () => {
    const selectedSong = getSelectedSong();
    if (!selectedSong) {
      return;
    }

    state.playlistDraftSelectionBySongId[selectedSong.id] = elements.playlistSelect.value;
  });

  elements.addToPlaylistButton.addEventListener("click", async () => {
    const selectedSong = getSelectedSong();
    const availablePlaylists = getAvailablePlaylistsForSong(selectedSong);
    const playlistId = Number(elements.playlistSelect.value);

    if (!selectedSong) {
      showToast(t("chooseSongFirst"));
      return;
    }

    if (!playlistId || !availablePlaylists.some((playlist) => playlist.id === playlistId)) {
      const message = !state.playlists.length
        ? t("createPlaylistFirst")
        : !availablePlaylists.length
          ? t("allPlaylistsAssigned")
          : t("selectPlaylistFirst");
      showToast(message);
      return;
    }

    try {
      state.playlistDraftSelectionBySongId[selectedSong.id] = String(playlistId);
      const nextState = await fetchJson(`/api/playlists/${playlistId}/songs`, {
        method: "POST",
        body: JSON.stringify({ songId: selectedSong.id }),
      });
      applyState(nextState);
      showToast(t("songAdded"));
    } catch (error) {
      showToast(error.message);
    }
  });

  elements.ktvPrepareButton.addEventListener("click", () => {
    prepareSelectedKtvSong();
  });

  elements.ktvLyricModeDefaultButton?.addEventListener("click", () => {
    setSelectedKtvLyricMode("default");
  });

  elements.ktvLyricModeExtractButton?.addEventListener("click", () => {
    setSelectedKtvLyricMode("extract");
  });

  elements.ktvRecordButton.addEventListener("click", () => {
    const song = getSelectedSong();
    if (song && state.ktvRecording?.songId === song.id) {
      stopKtvRecording();
      return;
    }

    startSelectedKtvRecording();
  });

  elements.ktvStopButton?.addEventListener("click", () => {
    stopKtvRecording();
  });

  elements.ktvSaveRecordingButton.addEventListener("click", () => {
    saveDraftKtvRecording();
  });

  elements.ktvDiscardRecordingButton.addEventListener("click", () => {
    discardDraftKtvRecording();
  });

  elements.ktvStageClose.addEventListener("click", () => {
    closeKtvStage();
  });

  elements.ktvSaveNameInput.addEventListener("input", () => {
    if (state.ktvDraftRecording) {
      state.ktvDraftRecording.name = elements.ktvSaveNameInput.value;
    }
  });

  elements.prevButton.addEventListener("click", () => {
    playRelative(-1);
  });

  elements.nextButton.addEventListener("click", () => {
    playRelative(1);
  });

  elements.playButton.addEventListener("click", async () => {
    if (state.currentSongId && state.isPlaying) {
      pausePlayback();
      return;
    }

    const song = getCurrentSong() || getSelectedSong() || getVisibleSongs()[0];
    if (!song) {
      showToast(t("noSongsAvailable"));
      return;
    }

    await playSong(song.id);
  });

  elements.progressInput.addEventListener("input", () => {
    if (!Number.isFinite(elements.mediaElement.duration) || !elements.mediaElement.duration) {
      return;
    }

    elements.mediaElement.currentTime =
      (Number(elements.progressInput.value) / 1000) * Number(elements.mediaElement.duration);
  });

  elements.miniCoverButton.addEventListener("click", () => {
    openImmersive();
  });

  elements.playerImmersiveButton.addEventListener("click", () => {
    openImmersive();
  });

  elements.playerLyricsButton.addEventListener("click", () => {
    if (state.currentSongId || state.selectedSongId) {
      openImmersive();
    } else {
      focusLyricsPanel();
    }
  });

  elements.playerQueueButton.addEventListener("click", () => {
    cyclePlaybackMode();
  });

  elements.editorClose.addEventListener("click", closeEditorPanel);
  elements.editorScrim.addEventListener("click", closeEditorPanel);

  elements.immersiveClose.addEventListener("click", closeImmersive);
  elements.immersiveEditButton.addEventListener("click", () => {
    closeImmersive();
    focusEditorPanel();
  });

  elements.immersiveOverlay.addEventListener("click", (event) => {
    if (event.target === elements.immersiveOverlay || event.target.classList.contains("immersive-scrim")) {
      closeImmersive();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && state.playlistDialog.open) {
      closePlaylistDialog();
      return;
    }

    if (event.key === "Escape" && state.playlistMenu.open) {
      closePlaylistMenu();
      return;
    }

    if (event.key === "Escape" && state.immersiveOpen) {
      closeImmersive();
      return;
    }

    if (event.key === "Escape" && state.ktvOpen) {
      closeKtvStage();
      return;
    }

    if (event.key === "Escape" && state.editorOpen) {
      closeEditorPanel();
    }
  });

  elements.sidebarResizer.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    startSidebarResize(event);
  });

  elements.sidebarResizer.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      updateSidebarWidth(state.sidebarWidth - 18, { persist: true });
      return;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      updateSidebarWidth(state.sidebarWidth + 18, { persist: true });
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      updateSidebarWidth(SIDEBAR_MIN_WIDTH, { persist: true });
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      updateSidebarWidth(SIDEBAR_MAX_WIDTH, { persist: true });
    }
  });

  elements.mediaElement.addEventListener("loadedmetadata", () => {
    const currentSong = getCurrentSong();
    if (currentSong && Number.isFinite(elements.mediaElement.duration)) {
      state.durationCache[currentSong.id] = elements.mediaElement.duration;
    }

    updatePlaybackMetrics();
    renderHeader();
    renderSongPanel();
  });

  elements.mediaElement.addEventListener("timeupdate", updatePlaybackMetrics);
  elements.mediaElement.addEventListener("play", () => {
    state.isPlaying = true;
    renderPlayer();
    renderSongPanel();
    renderLyricsPreview();
    renderImmersive();
  });

  elements.mediaElement.addEventListener("pause", () => {
    state.isPlaying = false;
    renderPlayer();
    renderSongPanel();
    renderLyricsPreview();
    renderImmersive();
  });

  elements.mediaElement.addEventListener("ended", async () => {
    state.isPlaying = false;
    renderPlayer();
    renderSongPanel();

    if (state.playbackMode === "repeat-one") {
      await replayCurrentSong();
      return;
    }

    await playRelative(1, true, { triggeredByEnd: true });
  });
}

async function loadState({ preserveSelection = true } = {}) {
  try {
    const nextState = await fetchJson("/api/state");
    applyState(nextState, { preserveSelection });
  } catch (error) {
    showToast(error.message);
  }
}

function applyState(nextState, { preserveSelection = true } = {}) {
  const previousSelectedSongId = preserveSelection ? state.selectedSongId : null;
  const previousCurrentSongId = state.currentSongId;

  state.libraryPath = nextState.libraryPath;
  state.songs = nextState.songs;
  state.recentSongIds = nextState.recentSongIds;
  state.playlists = nextState.playlists;
  state.ktv = nextState.ktv || {
    assetsBySongId: {},
    latestSessionsBySongId: {},
    sessions: [],
    config: {},
  };
  prunePlaylistDraftSelections();

  if (state.activeView.type === "playlist" && !getPlaylistById(state.activeView.playlistId)) {
    state.activeView = { type: "likes", playlistId: null };
  }

  if (state.playlistMenu.playlistId && !getPlaylistById(state.playlistMenu.playlistId)) {
    closePlaylistMenu();
  }

  if (state.playlistDialog.playlistId && !getPlaylistById(state.playlistDialog.playlistId)) {
    closePlaylistDialog();
  }

  const activeSongs = getActiveSongs();
  const selectedStillExists = previousSelectedSongId && getSongById(previousSelectedSongId);
  const selectedInView = activeSongs.some((song) => song.id === previousSelectedSongId);

  if (selectedInView) {
    state.selectedSongId = previousSelectedSongId;
  } else if (selectedStillExists) {
    state.selectedSongId = previousSelectedSongId;
  } else {
    state.selectedSongId = activeSongs[0]?.id || state.songs[0]?.id || null;
  }

  if (previousCurrentSongId && !getSongById(previousCurrentSongId)) {
    stopPlayback();
    showToast(t("currentSongGone"));
  }

  warmDurationCache(state.songs);
  renderAll();

  if (hasRunningKtvTask()) {
    scheduleKtvPolling();
  }
}

function renderAll() {
  applySidebarWidth();
  renderStaticCopy();
  renderSidebar();
  renderHeader();
  renderSongPanel();
  renderKtvPanel();
  renderEditorPanel();
  renderPlayer();
  renderImmersive();
  renderPlaylistMenu();
  renderPlaylistDialog();
}

function renderStaticCopy() {
  document.documentElement.lang = state.language === "zh" ? "zh-CN" : "en";
  document.title = `78DLC Player`;

  elements.brandKicker.textContent = t("privatePlayer");
  elements.profileAvatar.textContent = buildInitials(t("ownerName"));
  elements.profileName.textContent = t("ownerName");
  elements.profileSubtitle.textContent = t("localMusicLibrary");
  elements.likesLabel.textContent = t("likes");
  elements.recentLabel.textContent = t("recent");
  elements.playlistHeading.textContent = t("playlists");
  elements.playlistNameInput.placeholder = t("playlistNamePlaceholder");
  elements.sourcePathLabel.textContent = t("sourceFolder");
  elements.searchInput.placeholder = t("searchPlaceholder");
  elements.refreshButtonLabel.textContent = t("rescan");
  elements.offlineSaveButtonLabel.textContent = t("offlineSave");
  elements.heroPlayLabel.textContent = t("playAll");
  elements.focusEditorLabel.textContent = t("editSelected");
  elements.openImmersiveLabel.textContent = t("immersive");
  elements.tabSongs.textContent = t("songsTab");
  elements.tabEditor.textContent = t("editorTab");
  elements.tabLyrics.textContent = t("lyricsTab");
  if (elements.tabKtv) {
    elements.tabKtv.textContent = t("ktvTab");
  }
  renderOfflineButton();
  elements.songPanelKicker.textContent = t("library");
  elements.songPanelTitle.textContent = t("songQueue");
  elements.colIndex.textContent = t("index");
  elements.colTitle.textContent = t("title");
  elements.colArtist.textContent = t("artist");
  elements.colAlbum.textContent = t("album");
  elements.colDuration.textContent = t("duration");
  elements.colAction.textContent = t("action");
  elements.editorPanelKicker.textContent = t("inspector");
  elements.labelDisplayTitle.textContent = t("displayName");
  elements.labelFileStem.textContent = t("fileName");
  elements.labelArtist.textContent = t("artist");
  elements.labelAlbum.textContent = t("album");
  elements.labelNotes.textContent = t("notes");
  elements.labelLyrics.textContent = t("lyrics");
  elements.playlistMembershipLabel.textContent = t("includedIn");
  elements.saveSongLabel.textContent = t("saveSong");
  elements.autoFetchMetadataButton.textContent = t("autoFetch");
  elements.saveFetchedMetadataButton.textContent = t("saveFetched");
  elements.abandonFetchedMetadataButton.textContent = t("abandonFetched");
  elements.uploadCoverButton.textContent = t("uploadCover");
  elements.removeCoverButton.textContent = t("removeCover");
  elements.addToPlaylistButton.textContent = t("addToList");
  elements.lyricsPreviewKicker.textContent = t("lyrics");
  elements.lyricsPreviewTitle.textContent = t("preview");
  elements.ktvPanelKicker.textContent = t("ktvMode");
  elements.ktvPanelTitle.textContent = t("ktvScoring");
  elements.ktvSelectedKicker.textContent = t("selectedSong");
  elements.ktvPrepareButton.textContent = t("ktvPrepare");
  elements.ktvRecordButton.textContent = t("ktvStart");
  if (elements.ktvStopButton) {
    elements.ktvStopButton.textContent = t("ktvStopScore");
  }
  elements.ktvMonitorTitle.textContent = t("ktvLivePitch");
  elements.ktvPitchGuideSvg.setAttribute("aria-label", t("ktvPitchGuide"));
  elements.ktvPitchGuideEmpty.textContent = t("ktvPitchGuideMissing");
  elements.ktvLevelLabel.textContent = t("ktvLevel");
  elements.ktvLyricsHeading.textContent = t("lyrics");
  elements.ktvPreviewTitle.textContent = t("ktvPreview");
  elements.ktvPreviewStatus.textContent = t("ktvUnsaved");
  elements.ktvSaveNameLabel.textContent = t("ktvSaveAs");
  elements.ktvSaveRecordingButton.textContent = t("ktvSaveRecording");
  elements.ktvDiscardRecordingButton.textContent = t("ktvDiscardRecording");
  elements.ktvStemsTitle.textContent = t("ktvStems");
  elements.ktvResultTitle.textContent = t("ktvLatestResult");
  elements.playerLyricsButton.title = t("lyricsButton");
  elements.playerImmersiveButton.title = t("immersive");
  elements.immersiveKicker.textContent = t("immersivePlayback");
  elements.immersiveEditButton.textContent = t("editSelected");
  elements.immersiveAutoFetchButton.textContent = t("autoFetch");
  elements.immersiveUploadButton.textContent = t("uploadCover");
  elements.immersiveSaveFetchedButton.textContent = t("saveFetched");
  elements.immersiveAbandonFetchedButton.textContent = t("abandonFetched");
  elements.immersiveArtistLabel.textContent = t("artist");
  elements.immersiveAlbumLabel.textContent = t("album");
  elements.immersiveSourceLabel.textContent = t("format");
  elements.immersiveLyricsHeading.textContent = t("lyrics");
  elements.playlistCreateToggle.title = t("newPlaylist");
  elements.playlistCreateToggle.setAttribute("aria-label", t("newPlaylist"));
  elements.playlistSubmitButton.title = t("create");
  elements.playlistSubmitButton.setAttribute("aria-label", t("create"));
  elements.playlistCancelButton.title = t("cancel");
  elements.playlistCancelButton.setAttribute("aria-label", t("cancel"));
  elements.openSourceFolderButton.title = t("openSourceFolder");
  elements.openSourceFolderButton.setAttribute("aria-label", t("openSourceFolder"));
  elements.editorClose.title = t("closeEditor");
  elements.editorClose.setAttribute("aria-label", t("closeEditor"));
  elements.ktvStageClose.title = t("closeKtvStage");
  elements.ktvStageClose.setAttribute("aria-label", t("closeKtvStage"));
  elements.sidebarResizer.title = t("sidebarResizeLabel");
  elements.sidebarResizer.setAttribute("aria-label", t("sidebarResizeLabel"));
  elements.playlistMenuRename.textContent = t("rename");
  elements.playlistMenuDelete.textContent = t("deletePlaylist");
  renderPlaybackModeControl();

  for (const button of elements.languageButtons) {
    button.classList.toggle("active", button.dataset.language === state.language);
  }
}

function renderSidebar() {
  elements.likesCount.textContent = String(state.songs.length);
  elements.recentCount.textContent = String(getRecentSongs().length);
  elements.sourcePath.textContent = state.libraryPath || "-";
  const showCreateRow = state.playlistFormOpen && state.playlistsExpanded;
  elements.playlistCreateWrap.classList.toggle("is-open", showCreateRow);
  elements.playlistCreateWrap.setAttribute("aria-hidden", String(!showCreateRow));
  elements.playlistNameInput.disabled = !showCreateRow;
  elements.playlistSubmitButton.disabled = !showCreateRow;
  elements.playlistCancelButton.disabled = !showCreateRow;
  elements.playlistList.hidden = !state.playlistsExpanded;
  elements.playlistToggleIcon.style.transform = state.playlistsExpanded
    ? "rotate(0deg)"
    : "rotate(-90deg)";

  for (const navItem of elements.navItems) {
    navItem.classList.toggle("active", navItem.dataset.view === state.activeView.type);
  }

  if (!state.playlistsExpanded) {
    elements.playlistList.innerHTML = "";
    return;
  }

  if (!state.playlists.length) {
    elements.playlistList.innerHTML = `
      <div class="empty-state">
        <strong>${escapeHtml(t("noPlaylists"))}</strong><br />
        ${escapeHtml(t("noPlaylistsHint"))}
      </div>
    `;
    return;
  }

  elements.playlistList.innerHTML = state.playlists
    .map((playlist) => {
      const isActive =
        state.activeView.type === "playlist" && state.activeView.playlistId === playlist.id;
      const isMenuOpen = state.playlistMenu.open && state.playlistMenu.playlistId === playlist.id;

      return `
        <div class="playlist-row ${isActive ? "active" : ""} ${isMenuOpen ? "menu-open" : ""}" data-playlist-row data-playlist-id="${playlist.id}">
          <button class="playlist-item ${isActive ? "active" : ""}" data-playlist-id="${playlist.id}" type="button">
            <span class="playlist-item-main">
              <span class="ui-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M6 7h12" />
                  <path d="M6 12h12" />
                  <path d="M6 17h8" />
                </svg>
              </span>
              <span>${escapeHtml(playlist.name)}</span>
            </span>
            <small>${playlist.songCount}</small>
          </button>
          <button
            class="playlist-row-action icon-button small"
            data-playlist-action="menu"
            data-playlist-id="${playlist.id}"
            type="button"
            aria-label="${escapeHtml(t("playlistActions"))}"
            title="${escapeHtml(t("playlistActions"))}"
          >
            <span class="ui-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M12 5h.01" />
                <path d="M12 12h.01" />
                <path d="M12 19h.01" />
              </svg>
            </span>
          </button>
        </div>
      `;
    })
    .join("");
}

function renderPlaylistMenu() {
  const playlist = getPlaylistById(state.playlistMenu.playlistId);
  const isOpen = state.playlistMenu.open && Boolean(playlist);

  elements.playlistMenu.hidden = !isOpen;
  elements.playlistMenu.setAttribute("aria-hidden", String(!isOpen));

  if (!isOpen) {
    elements.playlistMenu.removeAttribute("style");
    return;
  }

  const estimatedWidth = 188;
  const estimatedHeight = 104;
  const left = Math.max(12, Math.min(state.playlistMenu.x, window.innerWidth - estimatedWidth - 12));
  const top = Math.max(12, Math.min(state.playlistMenu.y, window.innerHeight - estimatedHeight - 12));

  elements.playlistMenu.style.left = `${left}px`;
  elements.playlistMenu.style.top = `${top}px`;
}

function renderPlaylistDialog() {
  const playlist = getPlaylistById(state.playlistDialog.playlistId);
  const isOpen = state.playlistDialog.open && Boolean(playlist);
  const isRename = state.playlistDialog.mode === "rename";
  const isDelete = state.playlistDialog.mode === "delete";

  elements.playlistDialog.hidden = !isOpen;
  elements.playlistDialog.classList.toggle("is-open", isOpen);
  elements.playlistDialog.setAttribute("aria-hidden", String(!isOpen));

  if (!isOpen) {
    elements.playlistDialogInput.value = "";
    return;
  }

  elements.playlistDialogTitle.textContent = isRename ? t("renamePlaylistTitle") : t("deletePlaylistTitle");
  elements.playlistDialogCopy.textContent = isRename ? t("renamePlaylistCopy") : t("deletePlaylistCopy");
  elements.playlistDialogField.hidden = !isRename;
  elements.playlistDialogFieldLabel.textContent = t("playlistNameLabel");
  elements.playlistDialogInput.disabled = !isRename;
  elements.playlistDialogInput.value = isRename ? playlist.name : "";
  elements.playlistDialogConfirm.textContent = isRename ? t("save") : t("deletePlaylist");
  elements.playlistDialogConfirm.classList.toggle("danger", isDelete);
  elements.playlistDialogCancel.textContent = t("cancel");
}

function renderHeader() {
  const descriptor = getViewDescriptor();
  const activeSongs = getVisibleSongs();
  const currentSong = getCurrentSong();
  const headerSong = getSelectedSong() || currentSong;

  elements.heroLabel.textContent = descriptor.label;
  elements.heroSourceNote.textContent = descriptor.sourceNote;
  elements.heroTitle.textContent = descriptor.title;
  elements.heroSubtitle.textContent = descriptor.subtitle;
  elements.heroMetaLine.textContent = `${t("ownerName")} / ${t("synced")} ${formatDate(new Date())}`;
  elements.heroTrackCount.textContent = formatTrackCount(activeSongs.length);
  elements.heroDuration.textContent = buildTotalDurationLabel(activeSongs);
  elements.heroNowPlaying.textContent = `${t("nowPlaying")}: ${currentSong ? currentSong.displayTitle : t("idle")}`;
  elements.songPanelSummary.textContent = descriptor.panelSummary;
  renderCoverSurface(headerSong, descriptor.title, elements.headerCoverImage, elements.headerCoverPlaceholder);
}

function renderSongPanel() {
  const descriptor = getViewDescriptor();
  const visibleSongs = getVisibleSongs();
  const activeSongs = getActiveSongs();

  elements.songPanelTitle.textContent = t("songQueue");
  elements.songPanelSummary.textContent = descriptor.panelSummary;

  if (!visibleSongs.length) {
    const emptyMessage =
      state.activeView.type === "playlist" && !state.search
        ? t("noSongsInPlaylistYet")
        : state.search
          ? t("noSongsMatch")
          : t("noSongs");
    const showBrowseAction = state.activeView.type === "playlist" && activeSongs.length === 0 && !state.search;

    elements.songTableBody.innerHTML = `
      <tr>
        <td colspan="6">
          <div class="empty-state">
            <strong>${escapeHtml(emptyMessage)}</strong>
            ${
              showBrowseAction
                ? `<button class="text-button empty-state-action" data-empty-action="browse-library" type="button">${escapeHtml(
                    t("addSongsFromLibrary"),
                  )}</button>`
                : ""
            }
          </div>
        </td>
      </tr>
    `;
    return;
  }

  elements.songTableBody.innerHTML = visibleSongs
    .map((song, index) => {
      const isCurrent = state.currentSongId === song.id;
      const isSelected = state.selectedSongId === song.id;
      const playLabel = isCurrent && state.isPlaying ? t("pause") : t("play");
      const manageLabel = state.activeView.type === "playlist" ? t("remove") : t("edit");
      const manageAction =
        state.activeView.type === "playlist" ? "remove-from-playlist" : "open-editor";

      return `
        <tr class="${isCurrent ? "is-playing" : ""} ${isSelected ? "is-selected" : ""}" data-song-id="${song.id}">
          <td class="song-index">${renderSongIndex(song, index)}</td>
          <td>
            <div class="song-title-block">
              <strong>${escapeHtml(song.displayTitle)}</strong>
              <small>${escapeHtml(song.fileName)}</small>
            </div>
          </td>
          <td class="song-secondary">${escapeHtml(song.artist || "-")}</td>
          <td class="song-secondary">${escapeHtml(song.album || "-")}</td>
          <td class="song-duration">${formatSongDuration(song)}</td>
          <td class="song-action-cell">
            <div class="song-action-cell-inner">
              <button
                class="table-action ${isCurrent && state.isPlaying ? "playing" : ""}"
                data-action="toggle-play"
                data-song-id="${song.id}"
                type="button"
              >
                ${escapeHtml(playLabel)}
              </button>
              <button
                class="table-action subtle"
                data-action="${manageAction}"
                data-song-id="${song.id}"
                type="button"
              >
                ${escapeHtml(manageLabel)}
              </button>
              <button
                class="table-action subtle"
                data-action="open-ktv"
                data-song-id="${song.id}"
                type="button"
              >
                ${escapeHtml(t("ktvTab"))}
              </button>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");
}

function syncSongTableSelection() {
  for (const row of elements.songTableBody.querySelectorAll("tr[data-song-id]")) {
    row.classList.toggle("is-selected", Number(row.dataset.songId) === state.selectedSongId);
  }
}

function closePlaylistCreationRow() {
  state.playlistFormOpen = false;
  elements.playlistNameInput.value = "";
}

function openPlaylistMenu(playlistId, position) {
  state.playlistMenu = {
    open: true,
    playlistId,
    x: position.x,
    y: position.y,
  };
  renderSidebar();
  renderPlaylistMenu();
}

function closePlaylistMenu({ shouldRender = true } = {}) {
  if (!state.playlistMenu.open && !state.playlistMenu.playlistId) {
    return;
  }

  state.playlistMenu = { open: false, playlistId: null, x: 0, y: 0 };

  if (shouldRender) {
    renderSidebar();
    renderPlaylistMenu();
  }
}

function openPlaylistDialog(mode, playlistId) {
  state.playlistDialog = { open: true, mode, playlistId };
  closePlaylistMenu({ shouldRender: false });
  renderSidebar();
  renderPlaylistDialog();

  queueMicrotask(() => {
    if (mode === "rename") {
      elements.playlistDialogInput.focus();
      elements.playlistDialogInput.select();
      return;
    }

    elements.playlistDialogConfirm.focus();
  });
}

function closePlaylistDialog({ shouldRender = true } = {}) {
  if (!state.playlistDialog.open && !state.playlistDialog.playlistId) {
    return;
  }

  state.playlistDialog = { open: false, mode: null, playlistId: null };

  if (shouldRender) {
    renderPlaylistDialog();
  }
}

async function submitPlaylistDialog() {
  const playlist = getPlaylistById(state.playlistDialog.playlistId);
  if (!playlist) {
    closePlaylistDialog();
    return;
  }

  if (state.playlistDialog.mode === "rename") {
    const name = elements.playlistDialogInput.value.trim();

    if (!name) {
      showToast(t("playlistNameRequired"));
      return;
    }

    try {
      const nextState = await fetchJson(`/api/playlists/${playlist.id}`, {
        method: "PATCH",
        body: JSON.stringify({ name }),
      });
      closePlaylistDialog({ shouldRender: false });
      applyState(nextState);
      showToast(t("playlistRenamed"));
    } catch (error) {
      showToast(error.message);
    }

    return;
  }

  if (state.playlistDialog.mode === "delete") {
    try {
      const nextState = await fetchJson(`/api/playlists/${playlist.id}`, {
        method: "DELETE",
      });
      closePlaylistDialog({ shouldRender: false });
      applyState(nextState);
      showToast(t("playlistDeleted"));
    } catch (error) {
      showToast(error.message);
    }
  }
}

function renderEditorPanel() {
  const song = getSelectedSong();
  const previewSong = getMetadataPreviewSong(song);
  const hasSong = Boolean(song);
  elements.editorPanel.classList.toggle("is-open", state.editorOpen);
  elements.editorPanel.setAttribute("aria-hidden", String(!state.editorOpen));
  elements.editorScrim.classList.toggle("is-open", state.editorOpen);
  elements.editorScrim.setAttribute("aria-hidden", String(!state.editorOpen));

  elements.songForm
    .querySelectorAll("input, textarea, button, select")
    .forEach((field) => {
      field.disabled = !hasSong;
    });

  if (!song) {
    elements.detailTitle.textContent = t("chooseSong");
    elements.detailBadge.textContent = "audio";
    elements.displayTitleInput.value = "";
    elements.fileStemInput.value = "";
    elements.fileExtensionLabel.textContent = "";
    elements.artistInput.value = "";
    elements.albumInput.value = "";
    elements.notesInput.value = "";
    elements.lyricsInput.value = "";
    elements.uploadCoverButton.textContent = t("uploadCover");
    elements.removeCoverButton.textContent = t("removeCover");
    elements.removeCoverButton.disabled = true;
    renderMetadataReview("editor", null);
    renderCoverSurface(null, t("chooseSong"), elements.coverImage, elements.coverPlaceholder);
    renderPlaylistMemberships();
    renderPlaylistSelect();
    renderLyricsPreview();
    return;
  }

  const formSong = previewSong || song;
  elements.detailTitle.textContent = formSong.displayTitle;
  elements.detailBadge.textContent = song.mediaKind;
  elements.displayTitleInput.value = formSong.displayTitle;
  elements.fileStemInput.value = song.fileStem;
  elements.fileExtensionLabel.textContent = pathExtension(song.fileName);
  elements.artistInput.value = formSong.artist;
  elements.albumInput.value = formSong.album;
  elements.notesInput.value = formSong.notes;
  elements.lyricsInput.value = formSong.lyrics;
  elements.uploadCoverButton.textContent = song.coverUrl ? t("replaceCover") : t("uploadCover");
  elements.removeCoverButton.textContent = t("removeCover");
  elements.removeCoverButton.disabled = !song.coverUrl;
  renderMetadataReview("editor", song);
  renderCoverSurface(formSong, formSong.displayTitle, elements.coverImage, elements.coverPlaceholder);
  renderPlaylistMemberships();
  renderPlaylistSelect();
  renderLyricsPreview();
}

function renderLyricsPreview() {
  const song = getSelectedSong();
  renderLyricsBlock(getMetadataPreviewSong(song) || song, elements.lyricsPreview, { immersive: false });
}

function renderPlaylistMemberships() {
  const song = getSelectedSong();

  if (!song) {
    elements.playlistMembershipList.innerHTML = `
      <p class="playlist-membership-empty">${escapeHtml(t("pickSong"))}</p>
    `;
    return;
  }

  const memberships = getSongPlaylistMemberships(song);
  if (!memberships.length) {
    elements.playlistMembershipList.innerHTML = `
      <p class="playlist-membership-empty">${escapeHtml(t("noPlaylistMemberships"))}</p>
    `;
    return;
  }

  elements.playlistMembershipList.innerHTML = memberships
    .map(
      (playlist) => `
        <div class="playlist-membership-pill" data-playlist-membership-id="${playlist.id}">
          <span class="playlist-membership-name">${escapeHtml(playlist.name)}</span>
          <button
            class="playlist-membership-remove"
            type="button"
            data-remove-playlist-id="${playlist.id}"
            aria-label="${escapeHtml(`${t("remove")}: ${playlist.name}`)}"
            title="${escapeHtml(t("remove"))}"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
      `,
    )
    .join("");
}

function renderPlaylistSelect() {
  const song = getSelectedSong();
  const availablePlaylists = getAvailablePlaylistsForSong(song);
  const canAssignPlaylist = Boolean(song) && availablePlaylists.length > 0;

  if (!state.playlists.length) {
    elements.playlistSelect.innerHTML = `<option value="">${escapeHtml(t("noPlaylists"))}</option>`;
  } else if (!song) {
    elements.playlistSelect.innerHTML = `<option value="">${escapeHtml(t("selectPlaylist"))}</option>`;
  } else if (!availablePlaylists.length) {
    elements.playlistSelect.innerHTML = `<option value="">${escapeHtml(t("allPlaylistsAssigned"))}</option>`;
  } else {
    const selectedPlaylistValue = resolvePlaylistSelection(song, availablePlaylists);
    const options = [
      `<option value="">${escapeHtml(t("selectPlaylist"))}</option>`,
      ...availablePlaylists.map(
        (playlist) => `<option value="${playlist.id}">${escapeHtml(playlist.name)}</option>`,
      ),
    ];

    elements.playlistSelect.innerHTML = options.join("");
    elements.playlistSelect.value = selectedPlaylistValue;
  }

  elements.playlistSelect.disabled = !canAssignPlaylist;
  elements.addToPlaylistButton.disabled = !canAssignPlaylist;
}

function renderKtvPanel() {
  const song = getSelectedSong();
  const readiness = song?.ktvReadiness || { ready: false, reasons: [] };
  const asset = getKtvAsset(song);
  const latestSession = getLatestKtvSession(song);
  const isRecording = Boolean(state.ktvRecording);
  const isSelectedRecording = isRecording && state.ktvRecording.songId === song?.id;
  const isPreparing = asset?.status === "running";
  const isPrepared = asset?.status === "complete" && Boolean(asset.accompanimentUrl) && Boolean(asset.referencePitchUrl);
  const hasDraftForSong = Boolean(state.ktvDraftRecording && state.ktvDraftRecording.songId === song?.id);
  const canAutoExtractLyrics = canAutoExtractKtvLyrics();
  const lyricMode = getKtvLyricMode(song);
  const isExtractMode = lyricMode === "extract";
  const canPrepareForKtv = Boolean(isExtractMode ? canAutoExtractLyrics : readiness.ready);
  const hasUsableLyricSource = Boolean(
    readiness.ready || (isExtractMode && (canAutoExtractLyrics || asset?.alignmentUrl)),
  );
  const canSingWithCurrentLyrics = Boolean(
    isExtractMode ? asset?.alignmentUrl || canAutoExtractLyrics : readiness.ready,
  );

  elements.ktvPanel.classList.toggle("is-stage-open", state.ktvOpen);
  elements.ktvPanel.setAttribute("aria-modal", String(state.ktvOpen));
  document.body.classList.toggle("is-ktv-stage-open", state.ktvOpen);
  elements.ktvReadinessPill.classList.toggle("is-ready", hasUsableLyricSource);
  elements.ktvReadinessPill.classList.toggle("is-blocked", !hasUsableLyricSource);
  elements.ktvPanelTitle.textContent = state.ktvOpen && song ? song.displayTitle : t("ktvScoring");
  elements.ktvPanelKicker.textContent = state.ktvOpen ? "KTV" : t("ktvMode");

  if (!song) {
    renderKtvStageScore(null);
    elements.ktvReadinessPill.textContent = t("ktvBlocked");
    elements.ktvReadinessPill.classList.remove("is-stage-scoring");
    elements.ktvSelectedTitle.textContent = t("nothingSelected");
    elements.ktvSelectedMeta.textContent = t("ktvSelectSong");
    elements.ktvStatusLine.textContent = t("ktvPanelSubtitle");
    renderKtvTaskStatus(null, null);
    renderKtvLyricModeControls(null, false, false);
    elements.ktvPrepareButton.disabled = true;
    elements.ktvRecordButton.disabled = true;
    elements.ktvRecordButton.classList.remove("is-stage-recording");
    if (elements.ktvStopButton) {
      elements.ktvStopButton.disabled = true;
    }
    elements.ktvStemLinks.innerHTML = `<p class="ktv-empty">${escapeHtml(t("ktvSelectSong"))}</p>`;
    elements.ktvStageProgressLabel.textContent = "0:00 / 0:00";
    elements.ktvLyrics.innerHTML = `<p class="lyrics-empty">${escapeHtml(t("immersiveEmpty"))}</p>`;
    renderKtvPitchMonitor();
    renderKtvPitchGuide(null, null);
    renderKtvCountdown();
    renderKtvRecordingPreview(null);
    renderKtvScore(null);
    return;
  }

  ensureKtvPitchGuide(song, asset);
  const canUseExtractLyrics = Boolean(canAutoExtractLyrics || asset?.alignmentUrl);
  renderKtvLyricModeControls(song, readiness.ready, canUseExtractLyrics);
  elements.ktvReadinessPill.textContent = isExtractMode
    ? canUseExtractLyrics
      ? t("ktvAutoLyrics")
      : t("ktvBlocked")
    : readiness.ready
      ? readiness.level === "synced"
        ? t("ktvSyncedLyrics")
        : t("ktvPlainLyrics")
      : t("ktvBlocked");
  elements.ktvReadinessPill.classList.toggle("is-stage-scoring", state.ktvOpen && isSelectedRecording);
  renderKtvStageScore(latestSession);
  elements.ktvSelectedTitle.textContent = song.displayTitle;
  elements.ktvSelectedMeta.textContent = buildSongMetaLine(song);
  elements.ktvStatusLine.textContent = buildKtvStatusLine(song, asset, latestSession);
  renderKtvTaskStatus(song, asset, {
    lyricMode,
    isExtractMode,
    isPrepared,
    canPrepareForKtv,
  });
  elements.ktvPrepareButton.textContent = state.ktvOpen
    ? isPreparing
      ? "准备中"
      : isPrepared
        ? isExtractMode
          ? t("ktvReextractLyrics")
          : "重录"
        : isExtractMode
          ? t("ktvExtractLyrics")
          : "准备音轨"
    : isPreparing
      ? t("ktvPreparing")
      : isExtractMode
        ? t("ktvExtractLyrics")
        : t("ktvPrepare");
  elements.ktvRecordButton.textContent = isSelectedRecording
    ? state.ktvOpen
      ? "完成"
      : t("ktvRecording")
    : state.ktvRecording?.status === "uploading"
      ? t("ktvUploadScoring")
      : state.ktvOpen
        ? "开始"
        : t("ktvStart");
  if (elements.ktvStopButton) {
    elements.ktvStopButton.textContent = state.ktvOpen ? "完成" : t("ktvStopScore");
  }
  elements.ktvRecordButton.classList.toggle("is-stage-recording", isSelectedRecording);
  elements.ktvPrepareButton.disabled = !canPrepareForKtv || isPreparing || isRecording;
  elements.ktvRecordButton.disabled =
    !canSingWithCurrentLyrics ||
    !isPrepared ||
    isPreparing ||
    (!isSelectedRecording && isRecording) ||
    hasDraftForSong ||
    state.ktvCountdown.active;
  if (elements.ktvStopButton) {
    elements.ktvStopButton.disabled = !isSelectedRecording || state.ktvRecording?.status === "uploading";
  }
  elements.ktvModelLabel.textContent = `${t("ktvModel")}: ${formatKtvModelLabel(asset)}`;
  elements.ktvConfidenceLabel.textContent = `${t("ktvConfidence")}: ${formatKtvConfidence(latestSession)}`;
  elements.ktvStageProgressLabel.textContent = `${formatTime(state.currentSongId === song.id ? state.currentTime : 0)} / ${formatTime(
    state.duration || state.durationCache[song.id] || 0,
  )}`;
  renderKtvPitchMonitor();
  renderKtvPitchGuide(song, asset);
  renderKtvCountdown();
  if (state.ktvOpen) {
    renderKtvStageLyrics(song, elements.ktvLyrics);
  } else {
    renderLyricsBlock(song, elements.ktvLyrics, { immersive: true });
  }
  renderKtvRecordingPreview(song);
  renderKtvStemLinks(asset);
  renderKtvScore(latestSession);
}

function renderKtvLyricModeControls(song, canUseDefaultLyrics, canUseExtractLyrics) {
  const mode = getKtvLyricMode(song);
  const buttons = [
    { element: elements.ktvLyricModeDefaultButton, mode: "default", label: t("ktvUseDefaultLyrics"), enabled: Boolean(song && canUseDefaultLyrics) },
    { element: elements.ktvLyricModeExtractButton, mode: "extract", label: t("ktvUseExtractLyrics"), enabled: Boolean(song && canUseExtractLyrics) },
  ];

  for (const button of buttons) {
    if (!button.element) {
      continue;
    }

    button.element.textContent = button.label;
    button.element.disabled = !button.enabled;
    button.element.classList.toggle("is-active", mode === button.mode);
    button.element.setAttribute("aria-pressed", String(mode === button.mode));
  }
}

function renderKtvTaskStatus(song, asset, context = {}) {
  if (!elements.ktvTaskStatus) {
    return;
  }

  if (!state.ktvOpen || !song) {
    elements.ktvTaskStatus.hidden = true;
    return;
  }

  const status = buildKtvTaskStatus(song, asset, context);
  if (status.state === "ready") {
    elements.ktvTaskStatus.hidden = true;
    elements.ktvPrepareButton.title = status.prepareTitle || "";
    elements.ktvRecordButton.title = status.recordTitle || "";
    return;
  }

  elements.ktvTaskStatus.hidden = false;
  elements.ktvTaskStatus.dataset.state = status.state;
  elements.ktvTaskStatus.setAttribute("aria-busy", String(status.busy));
  elements.ktvTaskTitle.textContent = status.title;
  elements.ktvTaskDetail.textContent = status.detail;
  elements.ktvTaskProgressFill.style.width = `${status.progress}%`;
  elements.ktvPrepareButton.title = status.prepareTitle || "";
  elements.ktvRecordButton.title = status.recordTitle || "";
}

function buildKtvTaskStatus(song, asset, context = {}) {
  const localTask = state.ktvUiTask?.songId === song.id ? state.ktvUiTask : null;
  const lyricMode = context.lyricMode || getKtvLyricMode(song);
  const isExtractMode = context.isExtractMode ?? lyricMode === "extract";
  const isPrepared = context.isPrepared ?? (asset?.status === "complete" && Boolean(asset.accompanimentUrl));
  const canPrepareForKtv = context.canPrepareForKtv ?? Boolean(isExtractMode ? canAutoExtractKtvLyrics() : song.ktvReadiness?.ready);
  const guideState = state.ktvPitchGuidesBySongId[song.id];

  if (localTask?.status === "requesting") {
    return {
      state: "busy",
      busy: true,
      progress: 8,
      title: t("ktvTaskSubmitting"),
      detail: t("ktvTaskSubmittingDetail"),
    };
  }

  if (localTask?.status === "failed") {
    return {
      state: "failed",
      busy: false,
      progress: 100,
      title: t("ktvTaskFailed"),
      detail: localTask.message || t("ktvPrepareFailed"),
    };
  }

  if (asset?.status === "running") {
    const stage = String(asset.modelReport?.stage || "queued");
    const usingExtractedLyrics = asset.modelReport?.lyrics?.mode === "extract" || isExtractMode;
    const stageMap = {
      queued: [12, t("ktvTaskQueued"), t("ktvTaskQueuedDetail")],
      separating: [30, t("ktvTaskSeparating"), t("ktvTaskSeparatingDetail")],
      aligning: [
        58,
        usingExtractedLyrics ? t("ktvTaskExtracting") : t("ktvTaskAligning"),
        usingExtractedLyrics ? t("ktvTaskExtractingDetail") : t("ktvTaskAligningDetail"),
      ],
      extracting: [58, t("ktvTaskExtracting"), t("ktvTaskExtractingDetail")],
      pitch: [82, t("ktvTaskPitch"), t("ktvTaskPitchDetail")],
      finalizing: [94, t("ktvTaskFinalizing"), t("ktvTaskFinalizingDetail")],
    };
    const [progress, title, detail] = stageMap[stage] || stageMap.queued;
    return { state: "busy", busy: true, progress, title, detail };
  }

  if (asset?.status === "failed") {
    return {
      state: "failed",
      busy: false,
      progress: 100,
      title: t("ktvTaskFailed"),
      detail: asset.errorMessage || t("ktvPrepareFailed"),
    };
  }

  if (isPrepared && guideState?.status === "loading") {
    return {
      state: "busy",
      busy: true,
      progress: 96,
      title: t("ktvTaskLoadingGuide"),
      detail: t("ktvTaskLoadingGuideDetail"),
    };
  }

  if (isPrepared && (song.ktvReadiness?.ready || (isExtractMode && asset?.alignmentUrl))) {
    return {
      state: "ready",
      busy: false,
      progress: 100,
      title: t("ktvTaskReady"),
      detail: t("ktvTaskReadyDetail"),
    };
  }

  if (!canPrepareForKtv) {
    return {
      state: "blocked",
      busy: false,
      progress: 0,
      title: isExtractMode ? t("ktvTaskNeedExtract") : t("ktvTaskNeedPrepare"),
      detail: isExtractMode ? t("ktvAutoExtractUnavailable") : t("ktvDefaultLyricsMissing"),
    };
  }

  return {
    state: "idle",
    busy: false,
    progress: 0,
    title: isExtractMode ? t("ktvTaskNeedExtract") : t("ktvTaskNeedPrepare"),
    detail: isExtractMode ? t("ktvTaskNeedExtractDetail") : t("ktvTaskNeedPrepareDetail"),
  };
}

function renderKtvStageScore(session) {
  const score = normalizeClientScore(session?.score?.total);
  elements.ktvStageScore.textContent = String(score);
  elements.ktvStageScoreFill.style.width = `${score}%`;
  elements.ktvStageScoreFill.classList.toggle("is-active", score > 0);
}

function renderKtvCountdown() {
  elements.ktvCountdown.hidden = !state.ktvCountdown.active;
  elements.ktvCountdown.dataset.step = String(state.ktvCountdown.step || 0);
}

function renderKtvPitchMonitor() {
  const pitch = state.ktvPitch;
  const cents = Number.isFinite(pitch.cents) ? pitch.cents : 0;
  const markerPercent = Math.max(0, Math.min(100, 50 + cents / 2));
  const level = normalizeClientScore(pitch.level);

  elements.ktvNoteLabel.textContent = pitch.note
    ? `${pitch.note} / ${pitch.status || t("ktvInTune")}`
    : t("ktvNoPitch");
  elements.ktvPitchMarker.style.left = `${markerPercent}%`;
  elements.ktvPitchMarker.classList.toggle("is-active", Boolean(pitch.note));
  elements.ktvPitchMarker.classList.toggle("is-sharp", cents > 18);
  elements.ktvPitchMarker.classList.toggle("is-flat", cents < -18);
  elements.ktvLevelMeter.value = String(level);
  elements.ktvLevelValue.textContent = String(level);
}

function renderKtvPitchGuide(song, asset) {
  const guideState = song ? state.ktvPitchGuidesBySongId[song.id] : null;
  const guide = guideState?.data;
  const currentTime = song && state.currentSongId === song.id ? state.currentTime || 0 : 0;
  const guidePoints = Array.isArray(guide?.points) ? guide.points : [];
  const livePoints = state.ktvPitchHistory.filter((point) => point.songId === song?.id);

  if (!song || !asset?.referencePitchUrl) {
    clearKtvPitchVisuals(t("ktvPitchGuideMissing"));
    return;
  }

  if (guideState?.status === "loading") {
    clearKtvPitchVisuals(t("ktvPitchGuideLoading"));
    return;
  }

  if (!guidePoints.length) {
    clearKtvPitchVisuals(t("ktvPitchGuideEmpty"));
    return;
  }

  const windowSeconds = state.ktvOpen ? 18 : 12;
  const firstGuideTime = Number(guidePoints.find((point) => Number.isFinite(Number(point.time)))?.time) || 0;
  const leadTime = state.ktvOpen ? 5.5 : 3;
  const windowStart =
    state.ktvOpen && currentTime < firstGuideTime - leadTime
      ? Math.max(0, firstGuideTime - leadTime)
      : Math.max(0, currentTime - leadTime);
  const windowEnd = windowStart + windowSeconds;
  const visibleReference = guidePoints.filter(
    (point) => point.time >= windowStart - 0.6 && point.time <= windowEnd + 0.6,
  );
  const visibleLive = livePoints.filter(
    (point) => point.time >= windowStart - 0.6 && point.time <= windowEnd + 0.6,
  );

  const midiValues = [...visibleReference, ...visibleLive]
    .map((point) => Number(point.midi))
    .filter(Number.isFinite);
  const minMidi = Math.floor(Math.min(...midiValues, 48) - 2);
  const maxMidi = Math.ceil(Math.max(...midiValues, 72) + 2);
  const scale = {
    windowStart,
    windowEnd,
    minMidi,
    maxMidi: Math.max(maxMidi, minMidi + 6),
    width: 1000,
    height: 260,
  };

  elements.ktvPitchGuideEmpty.hidden = true;
  elements.ktvReferencePitchPath.setAttribute("d", buildPitchSvgPath(visibleReference, scale));
  elements.ktvLivePitchPath.setAttribute("d", buildPitchSvgPath(visibleLive, scale));
  renderPitchBarElements(elements.ktvReferencePitchBars, visibleReference, scale, currentTime, {
    kind: "reference",
  });
  renderPitchBarElements(elements.ktvLivePitchBars, visibleLive, scale, currentTime, {
    kind: "live",
  });
  renderPitchHtmlBars(elements.ktvReferencePitchLayer, visibleReference, scale, currentTime, {
    kind: "reference",
  });
  renderPitchHtmlBars(elements.ktvLivePitchLayer, visibleLive, scale, currentTime, {
    kind: "live",
  });
  renderKtvNoteParticleElements(elements.ktvNoteParticles, visibleReference, scale, currentTime);

  const playheadX = scaleTimeToPitchX(currentTime, scale);
  const referenceAtPlayhead = getNearestPitchPoint(visibleReference, currentTime);
  const playheadY = referenceAtPlayhead ? scaleMidiToPitchY(referenceAtPlayhead.midi, scale) : scale.height / 2;
  elements.ktvPitchActiveWindow.setAttribute("width", String(Math.max(0, playheadX)));
  elements.ktvPitchPlayheadGlow.setAttribute("cx", String(playheadX));
  elements.ktvPitchPlayheadGlow.setAttribute("cy", String(playheadY));
  elements.ktvPitchPlayhead.setAttribute("x1", String(playheadX));
  elements.ktvPitchPlayhead.setAttribute("x2", String(playheadX));
}

function renderKtvRecordingPreview(song) {
  const draft = song && state.ktvDraftRecording?.songId === song.id ? state.ktvDraftRecording : null;
  elements.ktvPreviewPanel.hidden = !draft;

  if (!draft) {
    elements.ktvPreviewAudio.removeAttribute("src");
    elements.ktvSaveNameInput.value = "";
    elements.ktvSaveRecordingButton.disabled = true;
    elements.ktvDiscardRecordingButton.disabled = true;
    return;
  }

  if (elements.ktvPreviewAudio.src !== draft.url) {
    elements.ktvPreviewAudio.src = draft.url;
  }

  elements.ktvPreviewStatus.textContent = draft.status === "saving" ? t("ktvUploadScoring") : t("ktvUnsaved");
  elements.ktvSaveNameInput.value = draft.name;
  elements.ktvSaveRecordingButton.disabled = draft.status === "saving";
  elements.ktvDiscardRecordingButton.disabled = draft.status === "saving";
}

function renderKtvStemLinks(asset) {
  if (!asset || asset.status !== "complete") {
    const label =
      asset?.status === "failed"
        ? `${t("ktvPrepareFailed")}: ${asset.errorMessage || ""}`
        : asset?.status === "running"
          ? t("ktvPreparing")
          : t("ktvNoResult");
    elements.ktvStemLinks.innerHTML = `<p class="ktv-empty">${escapeHtml(label)}</p>`;
    return;
  }

  const links = [
    { label: t("ktvVocals"), url: asset.vocalsUrl },
    { label: t("ktvAccompaniment"), url: asset.accompanimentUrl },
    { label: t("ktvBackground"), url: asset.backgroundUrl },
  ].filter((entry) => entry.url);

  elements.ktvStemLinks.innerHTML = links
    .map(
      (entry) => `
        <a class="ktv-stem-link" href="${escapeHtml(entry.url)}" target="_blank" rel="noreferrer">
          ${escapeHtml(entry.label)}
        </a>
      `,
    )
    .join("");
}

function renderKtvScore(session) {
  if (!session) {
    elements.ktvScoreBody.innerHTML = `<p class="ktv-empty">${escapeHtml(t("ktvNoResult"))}</p>`;
    return;
  }

  if (session.status === "failed") {
    elements.ktvScoreBody.innerHTML = `<p class="ktv-empty">${escapeHtml(session.errorMessage || t("ktvRecordingFailed"))}</p>`;
    return;
  }

  if (session.status !== "complete") {
    elements.ktvScoreBody.innerHTML = `<p class="ktv-empty">${escapeHtml(t("ktvUploadScoring"))}</p>`;
    return;
  }

  const score = session.score || {};
  const overall = Number.isFinite(Number(session.overallScore)) ? Number(session.overallScore) : score.overall || 0;
  const components = score.components || {};
  const breakdown = [
    [t("ktvTiming"), components.timing],
    [t("ktvEnergy"), components.energy],
    [t("ktvPitch"), components.pitch],
    [t("ktvLyricsScore"), components.lyrics],
  ];

  elements.ktvScoreBody.innerHTML = `
    <div class="ktv-score-hero" style="--score:${escapeHtml(String(overall))}">
      <span>${escapeHtml(t("ktvScore"))}</span>
      <strong>${escapeHtml(String(Math.round(overall)))}</strong>
    </div>
    <div class="ktv-breakdown">
      ${breakdown
        .map(
          ([label, value]) => `
            <div class="ktv-breakdown-row">
              <span>${escapeHtml(label)}</span>
              <meter min="0" max="100" value="${escapeHtml(String(normalizeClientScore(value)))}"></meter>
              <strong>${escapeHtml(String(normalizeClientScore(value)))}</strong>
            </div>
          `,
        )
        .join("")}
    </div>
    <p class="ktv-score-model">${escapeHtml(`${t("ktvModel")}: ${score.model || "-"}`)}</p>
  `;
}

function buildKtvStatusLine(song, asset, latestSession) {
  const readiness = song.ktvReadiness;
  const lyricMode = getKtvLyricMode(song);
  if (!readiness?.ready) {
    if (asset?.status === "running") {
      return t("ktvPreparing");
    }

    if (asset?.status === "failed") {
      return `${t("ktvPrepareFailed")}: ${asset.errorMessage || ""}`;
    }

    if (lyricMode === "extract") {
      return canAutoExtractKtvLyrics() ? t("ktvAutoLyricsReady") : t("ktvAutoExtractUnavailable");
    }

    return t("ktvDefaultLyricsMissing");
  }

  if (state.ktvRecording?.songId === song.id) {
    return state.ktvRecording.status === "uploading" ? t("ktvUploadScoring") : t("ktvRecording");
  }

  if (state.ktvDraftRecording?.songId === song.id) {
    return t("ktvRecordingReady");
  }

  if (asset?.status === "running") {
    return t("ktvPreparing");
  }

  if (asset?.status === "failed") {
    return `${t("ktvPrepareFailed")}: ${asset.errorMessage || ""}`;
  }

  if (asset?.status === "complete" && !asset.referencePitchUrl) {
    return t("ktvPitchGuideMissing");
  }

  if (latestSession?.status === "complete") {
    return `${t("ktvLatestResult")}: ${Math.round(latestSession.overallScore || 0)}`;
  }

  return asset?.status === "complete" ? t("ktvPrepared") : t("ktvPrepareFirst");
}

function renderMetadataReview(surface, song) {
  const preview = song ? getMetadataPreviewForSong(song.id) : null;
  const container =
    surface === "immersive" ? elements.immersiveMetadataReview : elements.metadataReview;
  const textElement =
    surface === "immersive" ? elements.immersiveMetadataReviewText : elements.metadataReviewText;

  if (!preview) {
    container.hidden = true;
    textElement.textContent = "";
    return;
  }

  container.hidden = false;
  const fieldLabel = preview.enrichment.fields.length
    ? preview.enrichment.fields.join(", ")
    : "metadata";
  const sourceLabel = preview.enrichment.sources.length
    ? preview.enrichment.sources.join(" + ")
    : "online source";
  textElement.textContent = `${t("metadataReady")} ${fieldLabel} / ${sourceLabel}`;
}

function getMetadataPreviewForSong(songId) {
  return state.metadataPreview?.songId === songId ? state.metadataPreview : null;
}

function getMetadataPreviewSong(song) {
  const preview = song ? getMetadataPreviewForSong(song.id) : null;
  if (!preview) {
    return null;
  }

  const values = preview.enrichment.values || {};
  return {
    ...song,
    displayTitle: values.displayTitle || song.displayTitle,
    artist: values.artist || "",
    album: values.album || "",
    notes: values.notes || "",
    lyrics: values.lyrics || "",
    coverUrl: preview.enrichment.coverSourceUrl || song.coverUrl,
  };
}

async function previewSongMetadata(songId, surface) {
  const triggerButton =
    surface === "immersive" ? elements.immersiveAutoFetchButton : elements.autoFetchMetadataButton;
  triggerButton.disabled = true;
  showBlockingLoader(["fetchStagePrepare", "fetchStageCatalog", "fetchStageLyrics", "fetchStagePreview"]);

  try {
    const payload = await fetchJson(`/api/songs/${songId}/enrich/preview`, { method: "POST" });
    if (!payload.enrichment?.updated) {
      state.metadataPreview = null;
      renderAll();
      showToast(t("metadataNotFound"));
      return;
    }

    state.metadataPreview = {
      songId,
      surface,
      enrichment: payload.enrichment,
    };
    renderAll();
    showToast(t("metadataReady"));
  } catch (error) {
    showToast(error.message);
  } finally {
    hideBlockingLoader();
    triggerButton.disabled = false;
    triggerButton.textContent = t("autoFetch");
  }
}

async function saveFetchedMetadata() {
  const preview = state.metadataPreview;
  if (!preview) {
    return;
  }

  elements.saveFetchedMetadataButton.disabled = true;
  elements.immersiveSaveFetchedButton.disabled = true;
  showBlockingLoader(["fetchStageSaving", "fetchStageLyrics", "fetchStagePreview"]);

  try {
    const payload = await fetchJson(`/api/songs/${preview.songId}/enrich`, {
      method: "POST",
      body: JSON.stringify({ enrichment: preview.enrichment }),
    });
    state.metadataPreview = null;
    applyState(payload.state);
    showToast(payload.enrichment?.updated ? t("metadataFetched") : t("metadataNotFound"));
  } catch (error) {
    showToast(error.message);
  } finally {
    hideBlockingLoader();
    elements.saveFetchedMetadataButton.disabled = false;
    elements.immersiveSaveFetchedButton.disabled = false;
  }
}

function abandonFetchedMetadata() {
  if (!state.metadataPreview) {
    return;
  }

  state.metadataPreview = null;
  renderAll();
  showToast(t("metadataAbandoned"));
}

function showBlockingLoader(stageKeys) {
  const stages = stageKeys.length ? stageKeys : ["fetchStagePrepare"];
  clearInterval(blockingLoaderTimer);
  blockingLoaderStageIndex = 0;
  elements.blockingLoader.hidden = false;
  document.body.classList.add("is-blocked");

  const updateStage = () => {
    const key = stages[Math.min(blockingLoaderStageIndex, stages.length - 1)];
    elements.blockingLoaderText.textContent = t(key);
    if (blockingLoaderStageIndex < stages.length - 1) {
      blockingLoaderStageIndex += 1;
    }
  };

  updateStage();
  blockingLoaderTimer = setInterval(updateStage, 1500);
}

function hideBlockingLoader() {
  clearInterval(blockingLoaderTimer);
  blockingLoaderTimer = null;
  elements.blockingLoader.hidden = true;
  document.body.classList.remove("is-blocked");
}

function renderPlayer() {
  const currentSong = getCurrentSong();
  renderPlaybackModeControl();

  if (!currentSong) {
    elements.playerTitle.textContent = t("nothingSelected");
    elements.playerSubtitle.textContent = t("pickSong");
    elements.playerStatusLabel.textContent = t("paused");
    elements.currentTimeLabel.textContent = "0:00";
    elements.durationLabel.textContent = "0:00";
    elements.progressInput.value = "0";
    elements.miniCover.style.backgroundImage = "";
    elements.miniCover.textContent = buildInitials(t("nothingSelected"));
    setPlayButtonState(false);
    updateMediaSession();
    return;
  }

  elements.playerTitle.textContent = currentSong.displayTitle;
  elements.playerSubtitle.textContent = buildSongMetaLine(currentSong);
  elements.playerStatusLabel.textContent = state.isPlaying ? t("playing") : t("paused");
  elements.currentTimeLabel.textContent = formatTime(state.currentTime);
  elements.durationLabel.textContent = formatTime(state.duration || state.durationCache[currentSong.id] || 0);
  elements.progressInput.value =
    state.duration > 0 ? String(Math.round((state.currentTime / state.duration) * 1000)) : "0";
  renderMiniCover(currentSong);
  setPlayButtonState(state.isPlaying);
  updateMediaSession();
}

function renderImmersive() {
  const song = getCurrentSong() || getSelectedSong();
  const previewSong = getMetadataPreviewSong(song);
  elements.immersiveOverlay.classList.toggle("is-open", state.immersiveOpen);
  elements.immersiveOverlay.setAttribute("aria-hidden", String(!state.immersiveOpen));

  if (!song) {
    elements.immersiveTypeLabel.textContent = t("selectedSong");
    elements.immersiveTitle.textContent = t("nothingSelected");
    elements.immersiveSubtitle.textContent = t("pickSong");
    elements.immersiveArtist.textContent = "-";
    elements.immersiveAlbum.textContent = "-";
    elements.immersiveSource.textContent = "-";
    elements.immersiveProgressLabel.textContent = "0:00 / 0:00";
    elements.immersiveDisc.classList.remove("is-spinning");
    renderMetadataReview("immersive", null);
    renderCoverSurface(null, t("nothingSelected"), elements.immersiveCoverImage, elements.immersiveCoverPlaceholder);
    elements.immersiveLyrics.innerHTML = `<p class="lyrics-empty">${escapeHtml(t("immersiveEmpty"))}</p>`;
    return;
  }

  const displaySong = previewSong || song;
  elements.immersiveTypeLabel.textContent = state.currentSongId === song.id ? t("nowPlaying") : t("selectedSong");
  elements.immersiveTitle.textContent = displaySong.displayTitle;
  elements.immersiveSubtitle.textContent = buildSongMetaLine(displaySong);
  elements.immersiveArtist.textContent = displaySong.artist || "-";
  elements.immersiveAlbum.textContent = displaySong.album || "-";
  elements.immersiveSource.textContent = getSongTypeLabel(song);
  elements.immersiveProgressLabel.textContent = `${formatTime(state.currentTime)} / ${formatTime(
    state.duration || state.durationCache[song.id] || 0,
  )}`;
  elements.immersiveDisc.classList.toggle(
    "is-spinning",
    state.currentSongId === song.id && state.isPlaying,
  );
  renderMetadataReview("immersive", song);
  renderCoverSurface(displaySong, displaySong.displayTitle, elements.immersiveCoverImage, elements.immersiveCoverPlaceholder);
  renderLyricsBlock(displaySong, elements.immersiveLyrics, { immersive: true });
}

function renderPlaybackModeControl() {
  const label = getPlaybackModeLabel();
  elements.playerQueueButton.dataset.mode = state.playbackMode;
  elements.playerQueueButton.title = label;
  elements.playerQueueButton.setAttribute("aria-label", label);

  if (state.playbackMode === "shuffle") {
    elements.playerModeIcon.innerHTML = `
      <path d="M4 7h4l8 10h4" />
      <path d="m16 7 4 4-4 4" />
      <path d="M4 17h4l3-4" />
      <path d="M16 17h4" />
    `;
    return;
  }

  if (state.playbackMode === "repeat-one") {
    elements.playerModeIcon.innerHTML = `
      <path d="M17 7h2a1.8 1.8 0 0 1 1.8 1.8v1.4" />
      <path d="m18.8 5 2 2-2 2" />
      <path d="M7 17H5a1.8 1.8 0 0 1-1.8-1.8v-1.4" />
      <path d="m5.2 19-2-2 2-2" />
      <path d="M7 7h7" />
      <path d="M17 17h-7" />
      <text x="12" y="15.2" text-anchor="middle" font-size="7" font-weight="700" fill="currentColor" stroke="none">1</text>
    `;
    return;
  }

  elements.playerModeIcon.innerHTML = `
    <path d="M8 7h10" />
    <path d="M8 12h10" />
    <path d="M8 17h10" />
    <path d="M5 7h.01" />
    <path d="M5 12h.01" />
    <path d="M5 17h.01" />
  `;
}

function setupMediaSessionControls() {
  if (!("mediaSession" in navigator)) {
    return;
  }

  setMediaSessionAction("play", async () => {
    const song = getCurrentSong() || getSelectedSong() || getVisibleSongs()[0];
    if (song) {
      await playSong(song.id);
    }
  });
  setMediaSessionAction("pause", () => pausePlayback());
  setMediaSessionAction("previoustrack", () => playRelative(-1));
  setMediaSessionAction("nexttrack", () => playRelative(1));
  setMediaSessionAction("seekbackward", () => seekBy(-10));
  setMediaSessionAction("seekforward", () => seekBy(10));
  setMediaSessionAction("seekto", (details) => {
    if (Number.isFinite(details.seekTime)) {
      seekTo(details.seekTime);
    }
  });

  updateMediaSession();
}

function setMediaSessionAction(action, handler) {
  try {
    navigator.mediaSession.setActionHandler(action, handler);
  } catch (_error) {
    // Some browsers expose Media Session but not every action.
  }
}

async function setupOfflineSupport() {
  state.offline.supported = window.isSecureContext && "serviceWorker" in navigator && "caches" in window;
  const stored = loadStoredOfflineInfo();
  state.offline.cachedCount = stored.cachedCount;
  state.offline.cachedBytes = stored.cachedBytes;
  state.offline.lastSavedAt = stored.lastSavedAt;

  if (!state.offline.supported) {
    renderOfflineButton();
    return;
  }

  try {
    await navigator.serviceWorker.register("/service-worker.js");
    await navigator.serviceWorker.ready;
  } catch (_error) {
    state.offline.supported = false;
  }

  renderOfflineButton();
}

async function refreshOfflineCacheStatus() {
  if (!state.offline.supported) {
    renderOfflineButton();
    return;
  }

  try {
    const cache = await caches.open("78dlc-offline-v1");
    const cachedState = await cache.match("/api/state");
    if (cachedState) {
      const payload = await cachedState.clone().json().catch(() => null);
      const songs = Array.isArray(payload?.songs) ? payload.songs : [];
      state.offline.cachedCount = songs.length || state.offline.cachedCount;
      state.offline.cachedBytes =
        songs.reduce((sum, song) => sum + (Number(song.fileSize) || 0), 0) ||
        state.offline.cachedBytes;
    }
  } catch (_error) {
    // Cache inspection is best-effort.
  }

  renderOfflineButton();
}

async function saveLibraryForOffline() {
  if (!state.offline.supported) {
    showToast(t("offlineUnsupported"));
    return;
  }

  const songs = state.songs.filter((song) => song.mediaUrl);
  if (!songs.length) {
    showToast(t("offlineNoSongs"));
    return;
  }

  state.offline.saving = true;
  state.offline.progressDone = 0;
  state.offline.progressTotal = songs.length;
  renderOfflineButton();

  const totalBytes = songs.reduce((sum, song) => sum + (Number(song.fileSize) || 0), 0);
  const estimate = navigator.storage?.estimate
    ? await navigator.storage.estimate().catch(() => null)
    : null;
  if (estimate?.quota && estimate?.usage && estimate.quota - estimate.usage < totalBytes) {
    showToast(t("offlineStorageLow"));
  } else {
    showToast(`${t("offlineProgress")} 0 / ${songs.length}`);
  }

  try {
    await navigator.serviceWorker.ready;
    const cache = await caches.open("78dlc-offline-v1");
    await cacheEssentialAppFiles(cache);

    const stateResponse = await fetch("/api/state", { cache: "no-store" });
    if (!stateResponse.ok) {
      throw new Error(`State request failed (${stateResponse.status}).`);
    }
    await cache.put("/api/state", stateResponse.clone());

    const cachedState = await stateResponse.clone().json().catch(() => null);
    const songsToCache = Array.isArray(cachedState?.songs) ? cachedState.songs : songs;
    const urls = buildOfflineAssetUrls(songsToCache);
    state.offline.progressTotal = urls.length;
    renderOfflineButton();

    for (const [index, url] of urls.entries()) {
      await cacheUrl(cache, url);
      state.offline.progressDone = index + 1;
      renderOfflineButton();
      if ((index + 1) % 4 === 0 || index === urls.length - 1) {
        showToast(`${t("offlineProgress")} ${index + 1} / ${urls.length}`);
      }
    }

    const offlineInfo = {
      cachedCount: songsToCache.length,
      cachedBytes: songsToCache.reduce((sum, song) => sum + (Number(song.fileSize) || 0), 0),
      lastSavedAt: new Date().toISOString(),
    };
    saveStoredOfflineInfo(offlineInfo);
    Object.assign(state.offline, offlineInfo);
    showToast(`${t("offlineSaved")} ${songsToCache.length} ${t("trackUnit")}`);
  } catch (error) {
    showToast(`${t("offlineFailed")}: ${error.message}`);
  } finally {
    state.offline.saving = false;
    state.offline.progressDone = 0;
    state.offline.progressTotal = 0;
    renderOfflineButton();
  }
}

async function cacheEssentialAppFiles(cache) {
  for (const url of [
    "/",
    "/index.html",
    "/styles.css",
    "/app.js",
    "/manifest.webmanifest",
    "/assets/icon.svg",
    "/assets/red-dragon-loader.gif",
  ]) {
    await cacheUrl(cache, url);
  }
}

function buildOfflineAssetUrls(songs) {
  const urls = [];
  const seen = new Set();

  for (const song of songs) {
    for (const url of [song.coverUrl, song.mediaUrl]) {
      if (!url || seen.has(url)) {
        continue;
      }

      seen.add(url);
      urls.push(url);
    }
  }

  return urls;
}

async function cacheUrl(cache, url) {
  const request = new Request(url, { cache: "no-store" });
  const response = await fetch(request);
  if (!response.ok) {
    throw new Error(`${url} (${response.status})`);
  }

  await cache.delete(url);
  await cache.put(url, response.clone());
}

function renderOfflineButton() {
  if (!elements.offlineSaveButton || !elements.offlineSaveButtonLabel) {
    return;
  }

  elements.offlineSaveButton.disabled = state.offline.saving || !state.offline.supported;
  elements.offlineSaveButton.classList.toggle("is-ready", !state.offline.saving && state.offline.cachedCount > 0);
  elements.offlineSaveButton.title = state.offline.supported
    ? state.offline.cachedCount > 0
      ? `${t("offlineReady")} · ${state.offline.cachedCount} ${t("trackUnit")}`
      : t("offlineSave")
    : t("offlineUnsupported");

  if (state.offline.saving) {
    const done = state.offline.progressDone;
    const total = state.offline.progressTotal;
    elements.offlineSaveButtonLabel.textContent = total ? `${done}/${total}` : t("offlineSaving");
    return;
  }

  elements.offlineSaveButtonLabel.textContent =
    state.offline.cachedCount > 0 ? t("offlineReady") : t("offlineSave");
}

function updateMediaSession() {
  if (!("mediaSession" in navigator)) {
    return;
  }

  const song = getCurrentSong();
  navigator.mediaSession.playbackState = state.isPlaying ? "playing" : "paused";

  if (!song) {
    return;
  }

  if (typeof MediaMetadata !== "undefined") {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: song.displayTitle,
      artist: song.artist || t("unknownArtist"),
      album: song.album || t("unsorted"),
      artwork: song.coverUrl
        ? [
            {
              src: song.coverUrl,
              sizes: "512x512",
              type: "image/*",
            },
          ]
        : [],
    });
  }

  if (typeof navigator.mediaSession.setPositionState !== "function") {
    return;
  }

  const duration = state.duration || state.durationCache[song.id] || elements.mediaElement.duration || 0;
  if (!Number.isFinite(duration) || duration <= 0) {
    return;
  }

  try {
    navigator.mediaSession.setPositionState({
      duration,
      playbackRate: elements.mediaElement.playbackRate || 1,
      position: Math.min(state.currentTime || 0, duration),
    });
  } catch (_error) {
    // Ignore position updates while metadata is still settling.
  }
}

function seekBy(deltaSeconds) {
  seekTo((elements.mediaElement.currentTime || 0) + deltaSeconds);
}

function seekTo(nextTime) {
  if (!Number.isFinite(elements.mediaElement.duration) || !elements.mediaElement.duration) {
    return;
  }

  elements.mediaElement.currentTime = Math.min(
    Math.max(0, nextTime),
    elements.mediaElement.duration,
  );
  updatePlaybackMetrics();
}

async function playSong(songId, { syncShuffle = true } = {}) {
  const song = getSongById(songId);
  if (!song) {
    return;
  }

  const targetUrl = song.mediaUrl;
  const isNewSong = state.currentSongId !== songId || elements.mediaElement.getAttribute("src") !== targetUrl;
  state.selectedSongId = songId;

  if (state.playbackMode === "shuffle" && syncShuffle) {
    ensureShuffleState(getVisibleSongs(), { anchorSongId: songId, reset: true });
  }

  if (isNewSong) {
    state.currentSongId = songId;
    state.currentTime = 0;
    state.duration = state.durationCache[songId] || 0;
    elements.mediaElement.src = targetUrl;
    elements.mediaElement.load();
  }

  try {
    await elements.mediaElement.play();
    state.isPlaying = true;
    renderHeader();
    renderSongPanel();
    renderEditorPanel();
    renderPlayer();
    renderImmersive();

    if (isNewSong) {
      recordSongPlay(songId);
    }
  } catch (error) {
    showToast(`${t("playbackFailed")}: ${error.message}`);
  }
}

async function recordSongPlay(songId) {
  try {
    const nextState = await fetchJson(`/api/songs/${songId}/play`, { method: "POST" });
    applyState(nextState);
  } catch (_error) {
    // Offline playback should not fail just because play history cannot be written.
  }
}

async function replayCurrentSong() {
  const currentSong = getCurrentSong();
  if (!currentSong) {
    return;
  }

  elements.mediaElement.currentTime = 0;
  state.currentTime = 0;

  try {
    await elements.mediaElement.play();
    state.isPlaying = true;
    renderPlayer();
    renderSongPanel();
    renderLyricsPreview();
    renderImmersive();
  } catch (error) {
    showToast(`${t("playbackFailed")}: ${error.message}`);
  }
}

function pausePlayback() {
  elements.mediaElement.pause();
  state.isPlaying = false;
  renderPlayer();
  renderSongPanel();
  renderImmersive();
}

function stopPlayback() {
  elements.mediaElement.pause();
  elements.mediaElement.removeAttribute("src");
  elements.mediaElement.load();
  state.currentSongId = null;
  state.isPlaying = false;
  state.currentTime = 0;
  state.duration = 0;
}

async function playRelative(offset, skipToast = false, { triggeredByEnd = false } = {}) {
  const queue = getVisibleSongs();
  if (!queue.length) {
    if (!skipToast) {
      showToast(t("noSongs"));
    }
    return;
  }

  if (state.playbackMode === "shuffle") {
    const nextSong = getShuffleRelativeSong(queue, offset, { triggeredByEnd });
    if (nextSong) {
      await playSong(nextSong.id, { syncShuffle: false });
    }
    return;
  }

  const currentIndex = queue.findIndex((song) => song.id === state.currentSongId);
  const nextIndex =
    currentIndex === -1
      ? offset >= 0
        ? 0
        : queue.length - 1
      : wrapIndex(currentIndex + offset, queue.length);

  await playSong(queue[nextIndex].id);
}

function cyclePlaybackMode() {
  const modes = ["queue", "shuffle", "repeat-one"];
  const currentIndex = modes.indexOf(state.playbackMode);
  state.playbackMode = modes[(currentIndex + 1) % modes.length];

  if (state.playbackMode !== "shuffle") {
    state.shuffleOrder = [];
    state.shuffleQueueKey = "";
    state.shuffleIndex = -1;
  } else {
    ensureShuffleState(getVisibleSongs(), {
      anchorSongId: state.currentSongId || getVisibleSongs()[0]?.id || null,
      reset: true,
    });
  }

  renderPlayer();
}

function getPlaybackModeLabel() {
  switch (state.playbackMode) {
    case "shuffle":
      return t("shuffleMode");
    case "repeat-one":
      return t("repeatOneMode");
    default:
      return t("queueMode");
  }
}

function ensureShuffleState(queue, { anchorSongId = null, reset = false } = {}) {
  if (!queue.length) {
    state.shuffleOrder = [];
    state.shuffleQueueKey = "";
    state.shuffleIndex = -1;
    return;
  }

  const queueIds = queue.map((song) => song.id);
  const queueKey = buildQueueKey(queue);
  const fallbackId = queue[0].id;
  const anchorId = queueIds.includes(Number(anchorSongId)) ? Number(anchorSongId) : fallbackId;
  const isValidOrder =
    !reset &&
    state.shuffleQueueKey === queueKey &&
    state.shuffleOrder.length === queueIds.length &&
    state.shuffleOrder.every((songId) => queueIds.includes(songId));

  if (!isValidOrder) {
    state.shuffleOrder = [anchorId, ...shuffleArray(queueIds.filter((songId) => songId !== anchorId))];
    state.shuffleQueueKey = queueKey;
    state.shuffleIndex = 0;
    return;
  }

  state.shuffleIndex = state.shuffleOrder.indexOf(anchorId);

  if (state.shuffleIndex === -1) {
    state.shuffleOrder = [anchorId, ...shuffleArray(queueIds.filter((songId) => songId !== anchorId))];
    state.shuffleIndex = 0;
  }
}

function getShuffleRelativeSong(queue, offset, { triggeredByEnd = false } = {}) {
  if (!queue.length) {
    return null;
  }

  if (queue.length === 1) {
    ensureShuffleState(queue, { anchorSongId: queue[0].id, reset: true });
    return queue[0];
  }

  ensureShuffleState(queue, { anchorSongId: state.currentSongId || queue[0].id });

  if (offset < 0) {
    const previousIndex =
      state.shuffleIndex <= 0 ? state.shuffleOrder.length - 1 : state.shuffleIndex - 1;
    state.shuffleIndex = previousIndex;
    return getSongById(state.shuffleOrder[state.shuffleIndex]);
  }

  const reachedEnd = state.shuffleIndex >= state.shuffleOrder.length - 1;
  if (reachedEnd) {
    startNewShuffleCycle(queue, { avoidSongId: triggeredByEnd ? state.currentSongId : null });
    return getSongById(state.shuffleOrder[state.shuffleIndex]);
  }

  state.shuffleIndex += 1;
  return getSongById(state.shuffleOrder[state.shuffleIndex]);
}

function startNewShuffleCycle(queue, { avoidSongId = null } = {}) {
  const ids = shuffleArray(queue.map((song) => song.id));

  if (avoidSongId && ids.length > 1 && ids[0] === avoidSongId) {
    const replacementIndex = ids.findIndex((songId) => songId !== avoidSongId);
    if (replacementIndex > 0) {
      [ids[0], ids[replacementIndex]] = [ids[replacementIndex], ids[0]];
    }
  }

  state.shuffleOrder = ids;
  state.shuffleQueueKey = buildQueueKey(queue);
  state.shuffleIndex = 0;
}

function updatePlaybackMetrics() {
  state.currentTime = Number.isFinite(elements.mediaElement.currentTime)
    ? elements.mediaElement.currentTime
    : 0;
  state.duration = Number.isFinite(elements.mediaElement.duration)
    ? elements.mediaElement.duration
    : state.duration;

  const currentSong = getCurrentSong();
  if (currentSong && state.duration > 0) {
    state.durationCache[currentSong.id] = state.duration;
  }

  renderPlayer();
  renderLyricsPreview();
  if (state.immersiveOpen) {
    renderImmersive();
  }
  if (state.ktvOpen || state.ktvRecording) {
    renderKtvPanel();
  }
}

function setActiveView(nextView) {
  closePlaylistMenu({ shouldRender: false });
  closePlaylistDialog({ shouldRender: false });
  state.activeView = nextView;
  state.search = "";
  state.editorOpen = false;
  closePlaylistCreationRow();
  elements.searchInput.value = "";
  state.selectedSongId = getActiveSongs()[0]?.id || state.songs[0]?.id || null;
  renderAll();
}

function setLanguage(language) {
  if (!MESSAGES[language] || state.language === language) {
    return;
  }

  state.language = language;
  window.localStorage.setItem("78dlc-language", language);
  renderAll();
}

function openImmersive() {
  if (!getCurrentSong() && !getSelectedSong()) {
    showToast(t("chooseSongFirst"));
    return;
  }

  state.immersiveOpen = true;
  renderImmersive();
}

function closeImmersive() {
  state.immersiveOpen = false;
  renderImmersive();
}

function startSidebarResize(pointerEvent) {
  closePlaylistMenu();
  const startX = pointerEvent.clientX;
  const startWidth = state.sidebarWidth;

  state.isSidebarResizing = true;
  elements.appShell.classList.add("is-sidebar-resizing");
  document.body.classList.add("is-sidebar-resizing");

  const onPointerMove = (moveEvent) => {
    const delta = moveEvent.clientX - startX;
    updateSidebarWidth(startWidth + delta);
  };

  const onPointerUp = () => {
    state.isSidebarResizing = false;
    elements.appShell.classList.remove("is-sidebar-resizing");
    document.body.classList.remove("is-sidebar-resizing");
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);
    updateSidebarWidth(state.sidebarWidth, { persist: true });
  };

  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp, { once: true });
}

function updateSidebarWidth(nextWidth, { persist = false } = {}) {
  state.sidebarWidth = clampSidebarWidth(nextWidth);
  applySidebarWidth();

  if (persist) {
    window.localStorage.setItem("78dlc-sidebar-width", String(state.sidebarWidth));
  }
}

function applySidebarWidth() {
  elements.appShell.style.setProperty("--sidebar-width", `${state.sidebarWidth}px`);
  elements.sidebarResizer.setAttribute("aria-valuemin", String(SIDEBAR_MIN_WIDTH));
  elements.sidebarResizer.setAttribute("aria-valuemax", String(SIDEBAR_MAX_WIDTH));
  elements.sidebarResizer.setAttribute("aria-valuenow", String(state.sidebarWidth));
}

function clampSidebarWidth(width) {
  return Math.max(SIDEBAR_MIN_WIDTH, Math.min(SIDEBAR_MAX_WIDTH, Math.round(width)));
}

function openEditorPanel({ focusLyrics = false } = {}) {
  state.selectedSongId = state.selectedSongId || getVisibleSongs()[0]?.id || state.songs[0]?.id || null;
  state.editorOpen = true;
  renderHeader();
  renderSongPanel();
  renderEditorPanel();
  elements.tabSongs.classList.remove("active");
  elements.tabEditor.classList.toggle("active", !focusLyrics);
  elements.tabLyrics.classList.toggle("active", focusLyrics);
  elements.tabKtv?.classList.remove("active");

  queueMicrotask(() => {
    if (focusLyrics) {
      elements.editorPanel.scrollTo({
        top: elements.lyricsPreviewPanel.offsetTop - 12,
        behavior: "smooth",
      });
      return;
    }

    elements.editorPanel.scrollTo({ top: 0, behavior: "smooth" });
    elements.displayTitleInput.focus();
  });
}

function closeEditorPanel({ shouldRender = true } = {}) {
  state.editorOpen = false;
  elements.tabSongs.classList.add("active");
  elements.tabEditor.classList.remove("active");
  elements.tabLyrics.classList.remove("active");
  elements.tabKtv?.classList.remove("active");

  if (shouldRender) {
    renderEditorPanel();
  }
}

function focusSongTable() {
  closeEditorPanel({ shouldRender: false });
  elements.tabSongs.classList.add("active");
  elements.tabEditor.classList.remove("active");
  elements.tabLyrics.classList.remove("active");
  elements.tabKtv?.classList.remove("active");
  renderEditorPanel();
  elements.songTableBody.closest(".song-panel").scrollIntoView({ behavior: "smooth", block: "start" });
}

function focusEditorPanel() {
  openEditorPanel({ focusLyrics: false });
}

function focusLyricsPanel() {
  openEditorPanel({ focusLyrics: true });
}

function focusKtvPanel() {
  closeEditorPanel({ shouldRender: false });
  elements.tabSongs.classList.remove("active");
  elements.tabEditor.classList.remove("active");
  elements.tabLyrics.classList.remove("active");
  elements.tabKtv?.classList.add("active");
  state.ktvOpen = true;
  renderEditorPanel();
  renderKtvPanel();
}

function closeKtvStage() {
  state.ktvOpen = false;
  renderKtvPanel();
}

async function prepareSelectedKtvSong() {
  const song = getSelectedSong();
  if (!song) {
    showToast(t("chooseSongFirst"));
    return;
  }

  const lyricMode = getKtvLyricMode(song);
  if (lyricMode === "default" && !song.ktvReadiness?.ready) {
    showToast(t("ktvDefaultLyricsMissing"));
    return;
  }

  if (lyricMode === "extract" && !canAutoExtractKtvLyrics()) {
    showToast(t("ktvAutoExtractUnavailable"));
    return;
  }

  state.ktvUiTask = { songId: song.id, status: "requesting", lyricMode };
  elements.ktvPrepareButton.disabled = true;
  renderKtvPanel();

  try {
    const nextState = await fetchJson(`/api/ktv/songs/${song.id}/prepare`, {
      method: "POST",
      body: JSON.stringify({ lyricMode }),
    });
    state.ktvUiTask = null;
    applyState(nextState);
    scheduleKtvPolling();
    showToast(lyricMode === "extract" ? t("ktvAutoPreparingToast") : t("ktvPreparingToast"));
  } catch (error) {
    state.ktvUiTask = { songId: song.id, status: "failed", lyricMode, message: error.message };
    showToast(error.message);
  } finally {
    renderKtvPanel();
  }
}

async function startSelectedKtvRecording() {
  const song = getSelectedSong();
  if (!song) {
    showToast(t("chooseSongFirst"));
    return;
  }

  const lyricMode = getKtvLyricMode(song);
  const asset = getKtvAsset(song);
  const canUseSelectedLyrics = lyricMode === "extract" ? Boolean(asset?.alignmentUrl) : Boolean(song.ktvReadiness?.ready);
  if (!canUseSelectedLyrics) {
    showToast(lyricMode === "extract" ? t("ktvAutoExtractFirst") : t("ktvDefaultLyricsMissing"));
    return;
  }

  if (asset?.status !== "complete" || !asset.accompanimentUrl) {
    showToast(t("ktvPrepareFirst"));
    return;
  }

  if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
    showToast(t("ktvMicUnavailable"));
    return;
  }

  try {
    state.ktvOpen = true;
    state.ktvPitchHistory = [];
    const payload = await fetchJson("/api/ktv/sessions", {
      method: "POST",
      body: JSON.stringify({ songId: song.id, lyricMode }),
    });
    applyState(payload.state);

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
      },
    });
    const mimeType = chooseRecordingMimeType();
    const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
    const chunks = [];

    recorder.addEventListener("dataavailable", (event) => {
      if (event.data?.size) {
        chunks.push(event.data);
      }
    });

    const countdownCompleted = await runKtvStartCountdown(song.id);
    if (!countdownCompleted) {
      for (const track of stream.getTracks()) {
        track.stop();
      }
      return;
    }

    recorder.addEventListener(
      "stop",
      () => {
        finalizeKtvRecordingPreview(payload.session.id, song, chunks, stream, recorder.mimeType || mimeType);
      },
      { once: true },
    );

    const pitchMonitor = await startKtvPitchMonitor(stream);
    state.ktvRecording = {
      sessionId: payload.session.id,
      songId: song.id,
      recorder,
      stream,
      chunks,
      pitchMonitor,
      status: "recording",
    };

    recorder.start(1000);
    await playKtvBackingTrack(song);
    renderKtvPanel();
  } catch (error) {
    state.ktvCountdown = { active: false, step: 0 };
    cleanupKtvRecording();
    showToast(`${t("ktvRecordingFailed")}: ${error.message}`);
    renderKtvPanel();
  }
}

async function runKtvStartCountdown(songId) {
  state.ktvCountdown = { active: true, step: 3 };
  renderKtvPanel();

  for (let step = 3; step >= 1; step -= 1) {
    state.ktvCountdown = { active: true, step };
    renderKtvPanel();
    await wait(620);
    if (state.selectedSongId !== songId) {
      state.ktvCountdown = { active: false, step: 0 };
      renderKtvPanel();
      return false;
    }
  }

  state.ktvCountdown = { active: false, step: 0 };
  renderKtvPanel();
  return true;
}

function wait(milliseconds) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });
}

function stopKtvRecording() {
  if (!state.ktvRecording?.recorder) {
    return;
  }

  state.ktvRecording.status = "previewing";
  pausePlayback();
  stopKtvPitchMonitor();
  renderKtvPanel();

  if (state.ktvRecording.recorder.state !== "inactive") {
    state.ktvRecording.recorder.stop();
  }
}

function finalizeKtvRecordingPreview(sessionId, song, chunks, stream, mimeType) {
  try {
    const chunkType = chunks.find((chunk) => chunk?.type)?.type || "";
    const resolvedMimeType = chunkType || mimeType || "application/octet-stream";
    const blob = new Blob(chunks, { type: resolvedMimeType });
    if (!blob.size) {
      throw new Error("Recording is empty.");
    }

    discardDraftKtvRecording({ silent: true });
    const url = URL.createObjectURL(blob);
    const suggestedName = buildKtvRecordingName(song);
    state.ktvDraftRecording = {
      sessionId,
      songId: song.id,
      blob,
      url,
      mimeType: blob.type || resolvedMimeType,
      name: suggestedName,
      suggestedName,
      status: "preview",
    };
    showToast(t("ktvRecordingReady"));
  } catch (error) {
    showToast(`${t("ktvRecordingFailed")}: ${error.message}`);
  } finally {
    for (const track of stream.getTracks()) {
      track.stop();
    }
    state.ktvRecording = null;
    stopKtvPitchMonitor();
    renderKtvPanel();
  }
}

async function saveDraftKtvRecording() {
  const draft = state.ktvDraftRecording;
  if (!draft?.blob) {
    return;
  }

  draft.status = "saving";
  renderKtvPanel();

  try {
    const name = elements.ktvSaveNameInput.value.trim() || draft.suggestedName;
    const params = new URLSearchParams({ name });
    const response = await fetch(`/api/ktv/sessions/${draft.sessionId}/recording?${params}`, {
      method: "POST",
      headers: {
        "Content-Type": draft.mimeType || "application/octet-stream",
      },
      body: draft.blob,
    });
    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(payload.error || "Request failed.");
    }

    applyState(payload.state);
    discardDraftKtvRecording({ silent: true });
    showToast(t("ktvScoredToast"));
  } catch (error) {
    showToast(`${t("ktvRecordingFailed")}: ${error.message}`);
  } finally {
    if (state.ktvDraftRecording) {
      state.ktvDraftRecording.status = "preview";
    }
    renderKtvPanel();
  }
}

function discardDraftKtvRecording({ silent = false } = {}) {
  if (!state.ktvDraftRecording) {
    return;
  }

  URL.revokeObjectURL(state.ktvDraftRecording.url);
  state.ktvDraftRecording = null;
  elements.ktvPreviewAudio.pause();
  elements.ktvPreviewAudio.removeAttribute("src");

  if (!silent) {
    showToast(t("ktvRecordingDiscarded"));
  }

  renderKtvPanel();
}

async function playKtvBackingTrack(song) {
  const asset = getKtvAsset(song);
  const targetUrl = asset?.status === "complete" && asset.accompanimentUrl ? asset.accompanimentUrl : song.mediaUrl;
  state.currentSongId = song.id;
  state.selectedSongId = song.id;
  state.currentTime = 0;
  state.duration = state.durationCache[song.id] || 0;
  elements.mediaElement.src = targetUrl;
  elements.mediaElement.load();
  await elements.mediaElement.play();
  state.isPlaying = true;
  renderHeader();
  renderSongPanel();
  renderPlayer();
  renderImmersive();
  renderKtvPanel();
}

function cleanupKtvRecording() {
  if (!state.ktvRecording) {
    return;
  }

  stopKtvPitchMonitor();
  for (const track of state.ktvRecording.stream?.getTracks?.() || []) {
    track.stop();
  }

  state.ktvRecording = null;
}

async function startKtvPitchMonitor(stream) {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) {
    return null;
  }

  const audioContext = new AudioContextClass();
  await audioContext.resume();
  const analyser = audioContext.createAnalyser();
  analyser.fftSize = 2048;
  analyser.smoothingTimeConstant = 0.08;
  const source = audioContext.createMediaStreamSource(stream);
  source.connect(analyser);
  const buffer = new Float32Array(analyser.fftSize);
  const monitor = {
    active: true,
    audioContext,
    analyser,
    source,
    buffer,
    frameId: null,
  };

  state.ktvPitch = {
    active: true,
    level: 0,
    frequency: 0,
    referenceFrequency: 0,
    note: "",
    cents: 0,
    status: t("ktvNoPitch"),
  };

  const update = () => {
    if (!monitor.active) {
      return;
    }

    analyser.getFloatTimeDomainData(buffer);
    const level = computeRmsLevel(buffer);
    const frequency = detectPitch(buffer, audioContext.sampleRate);
    const currentSong = getSongById(state.ktvRecording?.songId);
    const currentTime = currentSong && state.currentSongId === currentSong.id ? state.currentTime || 0 : 0;
    const reference = currentSong ? getReferencePitchAtTime(currentSong.id, currentTime) : null;
    const pitchInfo = frequency ? describePitch(frequency) : null;
    const cents =
      frequency && reference?.frequency
        ? Math.round(1200 * Math.log2(frequency / reference.frequency))
        : pitchInfo?.cents || 0;

    if (frequency && currentSong) {
      state.ktvPitchHistory.push({
        songId: currentSong.id,
        time: Number(currentTime.toFixed(2)),
        frequency,
        midi: frequencyToMidi(frequency),
      });
      if (state.ktvPitchHistory.length > 900) {
        state.ktvPitchHistory.splice(0, state.ktvPitchHistory.length - 900);
      }
    }

    state.ktvPitch = {
      active: true,
      level,
      frequency: frequency || 0,
      referenceFrequency: reference?.frequency || 0,
      note: pitchInfo?.note || "",
      cents,
      status: frequency ? getPitchStatusLabel(cents) : t("ktvNoPitch"),
    };
    renderKtvPitchMonitor();
    renderKtvPitchGuide(currentSong, getKtvAsset(currentSong));
    monitor.frameId = window.requestAnimationFrame(update);
  };

  update();
  return monitor;
}

function stopKtvPitchMonitor() {
  const monitor = state.ktvRecording?.pitchMonitor;
  if (monitor) {
    monitor.active = false;
    if (monitor.frameId) {
      window.cancelAnimationFrame(monitor.frameId);
    }
    monitor.source?.disconnect?.();
    monitor.audioContext?.close?.();
  }

  state.ktvPitch = {
    active: false,
    level: 0,
    frequency: 0,
    referenceFrequency: 0,
    note: "",
    cents: 0,
    status: t("ktvNoPitch"),
  };
  renderKtvPitchMonitor();
}

function computeRmsLevel(buffer) {
  let sum = 0;
  for (const sample of buffer) {
    sum += sample * sample;
  }

  return Math.round(Math.min(100, Math.sqrt(sum / buffer.length) * 220));
}

function detectPitch(buffer, sampleRate) {
  const rms = Math.sqrt(buffer.reduce((sum, sample) => sum + sample * sample, 0) / buffer.length);
  if (rms < 0.012) {
    return 0;
  }

  const minLag = Math.floor(sampleRate / 1000);
  const maxLag = Math.floor(sampleRate / 65);
  let bestLag = -1;
  let bestCorrelation = 0;

  for (let lag = minLag; lag <= maxLag; lag += 1) {
    let correlation = 0;
    for (let index = 0; index < buffer.length - lag; index += 1) {
      correlation += buffer[index] * buffer[index + lag];
    }
    correlation /= buffer.length - lag;

    if (correlation > bestCorrelation) {
      bestCorrelation = correlation;
      bestLag = lag;
    }
  }

  if (bestLag <= 0 || bestCorrelation < 0.002) {
    return 0;
  }

  return sampleRate / bestLag;
}

function describePitch(frequency) {
  const noteNumber = Math.round(frequencyToMidi(frequency));
  const targetFrequency = 440 * 2 ** ((noteNumber - 69) / 12);
  const cents = Math.round(1200 * Math.log2(frequency / targetFrequency));
  const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const octave = Math.floor(noteNumber / 12) - 1;
  return {
    note: `${noteNames[((noteNumber % 12) + 12) % 12]}${octave}`,
    cents,
  };
}

function frequencyToMidi(frequency) {
  return 12 * Math.log2(frequency / 440) + 69;
}

function getPitchStatusLabel(cents) {
  if (cents > 18) {
    return t("ktvSharp");
  }

  if (cents < -18) {
    return t("ktvFlat");
  }

  return t("ktvInTune");
}

function chooseRecordingMimeType() {
  const audio = document.createElement("audio");
  const candidates = [
    "audio/mp4;codecs=mp4a.40.2",
    "audio/mp4",
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/ogg;codecs=opus",
    "audio/wav",
  ];

  return (
    candidates.find((candidate) => {
      const recorderSupports = MediaRecorder.isTypeSupported(candidate);
      const playerSupports = audio.canPlayType(candidate.replace(";codecs=opus", "").replace(";codecs=mp4a.40.2", ""));
      return recorderSupports && playerSupports;
    }) || candidates.find((candidate) => MediaRecorder.isTypeSupported(candidate)) || ""
  );
}

function scheduleKtvPolling() {
  clearTimeout(ktvPollTimer);
  ktvPollTimer = setTimeout(async () => {
    await loadState();
    if (hasRunningKtvTask()) {
      scheduleKtvPolling();
    }
  }, 1800);
}

function hasRunningKtvTask() {
  return Object.values(state.ktv.assetsBySongId || {}).some((asset) => asset.status === "running");
}

function warmDurationCache(songs) {
  for (const song of songs) {
    if (Object.prototype.hasOwnProperty.call(state.durationCache, song.id) || durationProbeIds.has(song.id)) {
      continue;
    }

    durationProbeIds.add(song.id);
    durationProbeQueue.push(song);
  }

  pumpDurationQueue();
}

function pumpDurationQueue() {
  while (durationProbeActive < 2 && durationProbeQueue.length) {
    const song = durationProbeQueue.shift();
    durationProbeActive += 1;
    probeSongDuration(song);
  }
}

function probeSongDuration(song) {
  const probe = document.createElement(song.mediaKind === "video" ? "video" : "audio");
  let finished = false;

  const finalize = (duration) => {
    if (finished) {
      return;
    }

    finished = true;
    state.durationCache[song.id] = Number.isFinite(duration) && duration > 0 ? duration : null;
    probe.pause?.();
    probe.removeAttribute("src");
    probe.load?.();
    durationProbeActive -= 1;
    durationProbeIds.delete(song.id);
    renderHeader();
    renderSongPanel();
    renderPlayer();
    renderImmersive();
    pumpDurationQueue();
  };

  probe.preload = "metadata";
  probe.src = song.mediaUrl;
  probe.addEventListener("loadedmetadata", () => finalize(probe.duration), { once: true });
  probe.addEventListener("error", () => finalize(null), { once: true });
  setTimeout(() => finalize(null), 12000);
}

function renderLyricsBlock(song, container, { immersive }) {
  if (!song || !song.lyrics.trim()) {
    container.innerHTML = `<p class="lyrics-empty">${escapeHtml(
      immersive ? t("immersiveEmpty") : t("emptyLyrics"),
    )}</p>`;
    container.dataset.activeIndex = "";
    return;
  }

  const timedLines = parseTimedLyrics(song.lyrics);
  const lines = timedLines.length
    ? timedLines.map((line) => line.text)
    : song.lyrics
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

  if (!lines.length) {
    container.innerHTML = `<p class="lyrics-empty">${escapeHtml(
      immersive ? t("immersiveEmpty") : t("emptyLyrics"),
    )}</p>`;
    container.dataset.activeIndex = "";
    return;
  }

  const activeIndex =
    timedLines.length && state.currentSongId === song.id
      ? getTimedLyricIndex(timedLines)
      : getActiveLyricIndex(song, lines.length);
  container.innerHTML = lines
    .map((line, index) => {
      const active = index === activeIndex ? " is-active" : "";
      return `<p class="lyrics-line${active}">${escapeHtml(line)}</p>`;
    })
    .join("");

  if (immersive && container.dataset.activeIndex !== String(activeIndex)) {
    const activeLine = container.querySelector(".lyrics-line.is-active");
    activeLine?.scrollIntoView({ block: "center", behavior: "smooth" });
  }

  container.dataset.activeIndex = String(activeIndex);
}

function renderKtvStageLyrics(song, container) {
  const alignmentLines = song && getKtvLyricMode(song) === "extract" ? getKtvDisplayAlignmentLines(song) : [];

  if (!song || (!song.lyrics.trim() && !alignmentLines.length)) {
    container.innerHTML = `<p class="lyrics-empty">${escapeHtml(t("immersiveEmpty"))}</p>`;
    container.dataset.activeIndex = "";
    return;
  }

  const timedLines = alignmentLines.length ? alignmentLines : parseTimedLyrics(song.lyrics);
  const lines = timedLines.length
    ? timedLines.map((line) => line.text)
    : getDisplayLyricLines(song.lyrics);

  if (!lines.length) {
    container.innerHTML = `<p class="lyrics-empty">${escapeHtml(t("immersiveEmpty"))}</p>`;
    container.dataset.activeIndex = "";
    return;
  }

  const activeIndex =
    timedLines.length && state.currentSongId === song.id
      ? getTimedLyricIndex(timedLines)
      : getActiveLyricIndex(song, lines.length);
  const startIndex = Math.max(0, activeIndex);
  const visibleLines = lines.slice(startIndex, startIndex + 3);
  const currentLine = visibleLines[0] || lines[activeIndex] || "";
  const lineProgress = computeKtvLineProgress(timedLines, activeIndex, song);
  const sungLength = Math.max(0, Math.min(currentLine.length, Math.floor(currentLine.length * lineProgress)));
  const currentHtml = `<p class="lyrics-line ktv-stage-lyric-line is-active"><span class="ktv-lyric-sung">${escapeHtml(
    currentLine.slice(0, sungLength),
  )}</span><span class="ktv-lyric-pending">${escapeHtml(currentLine.slice(sungLength))}</span></p>`;
  const futureHtml = visibleLines
    .slice(1)
    .map((line, index) => {
      const className = index === 0 ? " is-next" : "";
      return `<p class="lyrics-line ktv-stage-lyric-line${className}">${escapeHtml(line)}</p>`;
    })
    .join("");

  container.innerHTML = `${currentHtml}${futureHtml}`;
  container.dataset.activeIndex = String(activeIndex);
}

function getKtvDisplayAlignmentLines(song) {
  const guide = state.ktvPitchGuidesBySongId[song.id]?.data;
  const alignmentLines = Array.isArray(guide?.alignment?.lines) ? guide.alignment.lines : [];
  return alignmentLines
    .map((line) => ({
      time: Number(line.start),
      end: Number(line.end),
      text: String(line.text || "").trim(),
      source: guide.alignment?.source || "",
      similarity: Number(line.similarity),
    }))
    .filter((line) => Number.isFinite(line.time) && line.text && isClientSingableLyricLine(line.text))
    .sort((left, right) => left.time - right.time);
}

function getDisplayLyricLines(lyrics) {
  return String(lyrics || "")
    .split("\n")
    .map((line) => line.replace(/\[[^\]]+\]/g, "").trim())
    .filter((line) => line.length > 0 && isClientSingableLyricLine(line));
}

function isClientSingableLyricLine(text) {
  const normalized = String(text || "").trim().toLowerCase();
  if (!normalized) {
    return false;
  }

  if (
    /^(title|artist|album|composer|composed by|written by|lyrics by|作词|作曲|编曲|歌手|歌曲|专辑)\b|composed by/.test(
      normalized,
    )
  ) {
    return false;
  }

  return normalized.replace(/\s+/g, "").length >= 3;
}

function computeKtvLineProgress(timedLines, activeIndex, song) {
  if (!timedLines.length || state.currentSongId !== song.id) {
    return 0.34;
  }

  const currentLine = timedLines[activeIndex];
  const nextLine = timedLines[activeIndex + 1];
  if (!currentLine) {
    return 0.34;
  }

  const startTime = Number(currentLine.time) || 0;
  const endTime = Number(currentLine.end) || Number(nextLine?.time) || startTime + 4;
  return Math.max(0, Math.min(1, (state.currentTime - startTime) / Math.max(0.8, endTime - startTime)));
}

function renderCoverSurface(song, fallbackLabel, imageEl, placeholderEl) {
  const coverUrl = song?.coverUrl || "";

  if (coverUrl) {
    imageEl.hidden = false;
    imageEl.src = coverUrl;
    placeholderEl.hidden = true;
    return;
  }

  imageEl.hidden = true;
  imageEl.removeAttribute("src");
  placeholderEl.hidden = false;
  placeholderEl.textContent = buildInitials(song?.displayTitle || fallbackLabel);
}

function renderMiniCover(song) {
  if (song.coverUrl) {
    elements.miniCover.style.backgroundImage = `url("${song.coverUrl}")`;
    elements.miniCover.textContent = "";
  } else {
    elements.miniCover.style.backgroundImage = "";
    elements.miniCover.textContent = buildInitials(song.displayTitle);
  }
}

function setPlayButtonState(isPlaying) {
  elements.playButton.title = isPlaying ? t("pause") : t("play");
  elements.playButtonIcon.innerHTML = isPlaying
    ? `<path d="M9 6h2.5v12H9z" /><path d="M12.5 6H15v12h-2.5z" />`
    : `<path d="m8 6 10 6-10 6z" />`;
}

function renderSongIndex(song, index) {
  if (state.currentSongId === song.id) {
    if (state.isPlaying) {
      return `<span class="playing-bars"><span></span><span></span><span></span></span>`;
    }

    return `<span>${index + 1}</span>`;
  }

  return String(index + 1).padStart(2, "0");
}

function getViewDescriptor() {
  const playlist = getActivePlaylist();

  if (state.activeView.type === "recent") {
    return {
      label: t("recentLabel"),
      title: t("recent"),
      subtitle: t("recentSubtitle"),
      sourceNote: t("sourceSynced"),
      panelSummary: `${formatTrackCount(getVisibleSongs().length)} / ${t("historyView")}`,
    };
  }

  if (playlist) {
    return {
      label: t("playlist"),
      title: playlist.name,
      subtitle: t("playlistSubtitle"),
      sourceNote: t("sourceSynced"),
      panelSummary: `${formatTrackCount(getVisibleSongs().length)} / ${t("playlistTracks")}`,
    };
  }

  return {
    label: t("collection"),
    title: t("likes"),
    subtitle: t("collectionSubtitle"),
    sourceNote: t("localSource"),
    panelSummary: `${formatTrackCount(getVisibleSongs().length)} / ${t("localLibrary")}`,
  };
}

function getVisibleSongs() {
  const query = state.search.trim().toLowerCase();

  return getActiveSongs().filter((song) => {
    if (!query) {
      return true;
    }

    return [song.displayTitle, song.fileName, song.artist, song.album, song.lyrics, song.notes]
      .join(" ")
      .toLowerCase()
      .includes(query);
  });
}

function getActiveSongs() {
  if (state.activeView.type === "recent") {
    return getRecentSongs();
  }

  if (state.activeView.type === "playlist") {
    const playlist = getActivePlaylist();
    return playlist ? playlist.songIds.map((songId) => getSongById(songId)).filter(Boolean) : [];
  }

  return [...state.songs];
}

function getRecentSongs() {
  return state.recentSongIds.map((songId) => getSongById(songId)).filter(Boolean);
}

function getActivePlaylist() {
  return state.activeView.type === "playlist"
    ? getPlaylistById(state.activeView.playlistId)
    : null;
}

function getSelectedSong() {
  return getSongById(state.selectedSongId);
}

function getCurrentSong() {
  return getSongById(state.currentSongId);
}

function getSongById(songId) {
  return state.songs.find((song) => song.id === Number(songId)) || null;
}

function getKtvAsset(song) {
  return song ? state.ktv.assetsBySongId?.[song.id] || null : null;
}

function getKtvLyricMode(song) {
  if (!song) {
    return "default";
  }

  const storedMode = state.ktvLyricModeBySongId[song.id];
  if (storedMode === "default" || storedMode === "extract") {
    if (storedMode === "default" && !song.ktvReadiness?.ready && canAutoExtractKtvLyrics()) {
      return "extract";
    }
    if (storedMode === "extract" && !canAutoExtractKtvLyrics() && song.ktvReadiness?.ready) {
      return "default";
    }
    return storedMode;
  }

  return song.ktvReadiness?.ready ? "default" : "extract";
}

function setSelectedKtvLyricMode(mode) {
  const song = getSelectedSong();
  if (!song || (mode !== "default" && mode !== "extract")) {
    return;
  }

  state.ktvLyricModeBySongId[song.id] = mode;
  state.ktvUiTask = null;
  renderKtvPanel();
}

function canAutoExtractKtvLyrics() {
  const config = state.ktv.config || {};
  if (config.automaticLyricExtraction) {
    return true;
  }

  return /whisper|asr|speech/i.test(String(config.alignment || ""));
}

function getLatestKtvSession(song) {
  return song ? state.ktv.latestSessionsBySongId?.[song.id] || null : null;
}

function formatKtvModelLabel(asset) {
  if (!asset) {
    return state.ktv.config?.separator || "-";
  }

  const report = asset.modelReport || {};
  return report.separator?.model || report.separator?.mode || asset.status || "-";
}

function formatKtvConfidence(session) {
  return session?.score?.confidence || "-";
}

function ensureKtvPitchGuide(song, asset) {
  if (!song || !asset?.referencePitchUrl) {
    return;
  }

  const current = state.ktvPitchGuidesBySongId[song.id];
  if (
    (current?.status === "ready" || current?.status === "loading" || current?.status === "failed") &&
    current.assetUpdatedAt === asset.updatedAt
  ) {
    return;
  }

  state.ktvPitchGuidesBySongId[song.id] = {
    status: "loading",
    data: null,
    error: "",
    assetUpdatedAt: asset.updatedAt,
  };
  fetchJson(asset.referencePitchUrl)
    .then((guide) => {
      state.ktvPitchGuidesBySongId[song.id] = {
        status: "ready",
        data: guide,
        error: "",
        assetUpdatedAt: asset.updatedAt,
      };
      renderKtvPanel();
    })
    .catch((error) => {
      state.ktvPitchGuidesBySongId[song.id] = {
        status: "failed",
        data: null,
        error: error.message,
        assetUpdatedAt: asset.updatedAt,
      };
      renderKtvPanel();
    });
}

function getReferencePitchAtTime(songId, time) {
  const guide = state.ktvPitchGuidesBySongId[songId]?.data;
  const points = Array.isArray(guide?.points) ? guide.points : [];
  if (!points.length) {
    return null;
  }

  let bestPoint = null;
  let bestDistance = Infinity;
  for (const point of points) {
    const distance = Math.abs(Number(point.time) - time);
    if (distance < bestDistance) {
      bestPoint = point;
      bestDistance = distance;
    }
    if (Number(point.time) > time + 0.45) {
      break;
    }
  }

  return bestDistance <= 0.45 ? bestPoint : null;
}

function buildPitchSvgPath(points, scale) {
  let path = "";
  let previousTime = null;

  for (const point of points) {
    const midi = Number(point.midi);
    if (!Number.isFinite(midi)) {
      continue;
    }

    const x = scaleTimeToPitchX(point.time, scale);
    const y = scaleMidiToPitchY(midi, scale);
    const command = previousTime === null || point.time - previousTime > 0.55 ? "M" : "L";
    path += `${command}${x.toFixed(1)} ${y.toFixed(1)} `;
    previousTime = point.time;
  }

  return path.trim();
}

function clearKtvPitchVisuals(message) {
  elements.ktvReferencePitchPath.setAttribute("d", "");
  elements.ktvLivePitchPath.setAttribute("d", "");
  elements.ktvReferencePitchBars.replaceChildren();
  elements.ktvLivePitchBars.replaceChildren();
  elements.ktvNoteParticles.replaceChildren();
  elements.ktvReferencePitchLayer.replaceChildren();
  elements.ktvLivePitchLayer.replaceChildren();
  elements.ktvPitchActiveWindow.setAttribute("width", "0");
  elements.ktvPitchPlayheadGlow.setAttribute("cx", "0");
  elements.ktvPitchPlayheadGlow.setAttribute("cy", "130");
  elements.ktvPitchPlayhead.setAttribute("x1", "0");
  elements.ktvPitchPlayhead.setAttribute("x2", "0");
  elements.ktvPitchGuideEmpty.hidden = false;
  elements.ktvPitchGuideEmpty.textContent = message;
}

function renderPitchBarElements(group, points, scale, currentTime, { kind }) {
  const segments = groupPitchPointsIntoSegments(points);
  const isLive = kind === "live";
  const nodes = segments.map((segment) => {
    const x = scaleTimeToPitchX(segment.start, scale);
    const endX = scaleTimeToPitchX(segment.end, scale);
    const width = Math.max(isLive ? 12 : 72, endX - x);
    const y = scaleMidiToPitchY(segment.midi, scale);
    const height = isLive ? 9 : 15;
    const className = isLive
      ? "ktv-live-note"
      : segment.end < currentTime - 0.04
        ? "ktv-guide-note is-sung"
        : segment.start <= currentTime + 0.12
          ? "ktv-guide-note is-current"
          : "ktv-guide-note is-future";
    const paint = isLive
      ? { fill: "#1f724e", opacity: "0.94", stroke: "#ffffff", "stroke-opacity": "0.28", "stroke-width": "1" }
      : segment.end < currentTime - 0.04
        ? { fill: "#ff3155", opacity: "1", stroke: "#ffffff", "stroke-opacity": "0.86", "stroke-width": "2" }
        : segment.start <= currentTime + 0.12
          ? { fill: "#ff6541", opacity: "1", stroke: "#ffffff", "stroke-opacity": "0.92", "stroke-width": "2" }
          : { fill: "#a8a8a8", opacity: "0.72", stroke: "#ffffff", "stroke-opacity": "0.16", "stroke-width": "1" };

    return createSvgNode("rect", {
      class: className,
      x: x.toFixed(1),
      y: (y - height / 2).toFixed(1),
      width: width.toFixed(1),
      height: String(height),
      rx: String(height / 2),
      ...paint,
    });
  });

  group.replaceChildren(...nodes);
}

function renderPitchHtmlBars(layer, points, scale, currentTime, { kind }) {
  const segments = groupPitchPointsIntoSegments(points);
  const isLive = kind === "live";
  const nodes = segments.map((segment) => {
    const x = scaleTimeToPitchX(segment.start, scale);
    const endX = scaleTimeToPitchX(segment.end, scale);
    const width = Math.max(isLive ? 12 : 72, endX - x);
    const y = scaleMidiToPitchY(segment.midi, scale);
    const height = isLive ? 9 : 15;
    const className = isLive
      ? "ktv-html-note ktv-html-note-live"
      : segment.end < currentTime - 0.04
        ? "ktv-html-note ktv-html-note-sung"
        : segment.start <= currentTime + 0.12
          ? "ktv-html-note ktv-html-note-current"
          : "ktv-html-note ktv-html-note-future";
    const node = document.createElement("span");
    node.className = className;
    node.style.left = `${(x / scale.width) * 100}%`;
    node.style.top = `${(y / scale.height) * 100}%`;
    node.style.width = `${(width / scale.width) * 100}%`;
    node.style.height = `${height}px`;
    return node;
  });

  layer.replaceChildren(...nodes);
}

function groupPitchPointsIntoSegments(points) {
  const normalized = points
    .map((point) => ({
      time: Number(point.time),
      midi: Number(point.midi),
    }))
    .filter((point) => Number.isFinite(point.time) && Number.isFinite(point.midi))
    .sort((a, b) => a.time - b.time);

  const segments = [];
  let current = null;

  for (const point of normalized) {
    const quantizedMidi = Math.round(point.midi * 2) / 2;
    if (
      current &&
      point.time - current.lastTime <= 0.22 &&
      Math.abs(quantizedMidi - current.midi) <= 0.75
    ) {
      current.end = point.time;
      current.lastTime = point.time;
      current.midi = current.midi * 0.7 + quantizedMidi * 0.3;
      continue;
    }

    if (current) {
      segments.push(current);
    }

    current = {
      start: point.time,
      end: point.time + 0.18,
      lastTime: point.time,
      midi: quantizedMidi,
    };
  }

  if (current) {
    segments.push(current);
  }

  return segments.map((segment) => ({
    start: segment.start,
    end: Math.max(segment.end, segment.start + 0.2),
    midi: segment.midi,
  }));
}

function renderKtvNoteParticleElements(group, referencePoints, scale, currentTime) {
  const segments = groupPitchPointsIntoSegments(referencePoints).filter(
    (segment) => segment.end <= currentTime + 0.35 && segment.end >= currentTime - 4.8,
  );
  const particles = segments.slice(-7);
  const nodes = particles.map((segment, index) => {
    const age = Math.max(0, currentTime - segment.end);
    const x = scaleTimeToPitchX(segment.end, scale) - age * 18;
    const y = scaleMidiToPitchY(segment.midi, scale) - 18 - index * 8;
    const opacity = Math.max(0.18, 1 - age / 4.8);

    if (index % 2 === 0) {
      const node = createSvgNode("text", {
        class: "ktv-note-particle-symbol",
        x: x.toFixed(1),
        y: y.toFixed(1),
        opacity: opacity.toFixed(2),
      });
      node.textContent = "♪";
      return node;
    }

    return createSvgNode("rect", {
      class: "ktv-note-particle-diamond",
      x: (x - 5).toFixed(1),
      y: (y - 8).toFixed(1),
      width: "10",
      height: "10",
      opacity: opacity.toFixed(2),
      transform: `rotate(45 ${x.toFixed(1)} ${(y - 3).toFixed(1)})`,
    });
  });

  group.replaceChildren(...nodes);
}

function createSvgNode(tagName, attributes) {
  const node = document.createElementNS(SVG_NAMESPACE, tagName);
  Object.entries(attributes).forEach(([name, value]) => {
    node.setAttribute(name, value);
  });
  return node;
}

function getNearestPitchPoint(points, currentTime) {
  let nearest = null;
  let nearestDistance = Infinity;
  for (const point of points) {
    const time = Number(point.time);
    const midi = Number(point.midi);
    if (!Number.isFinite(time) || !Number.isFinite(midi)) {
      continue;
    }

    const distance = Math.abs(time - currentTime);
    if (distance < nearestDistance) {
      nearest = { ...point, midi };
      nearestDistance = distance;
    }
  }

  return nearestDistance <= 0.8 ? nearest : null;
}

function scaleTimeToPitchX(time, scale) {
  const ratio = (time - scale.windowStart) / Math.max(0.1, scale.windowEnd - scale.windowStart);
  return Math.max(0, Math.min(scale.width, ratio * scale.width));
}

function scaleMidiToPitchY(midi, scale) {
  const ratio = (midi - scale.minMidi) / Math.max(1, scale.maxMidi - scale.minMidi);
  return Math.max(12, Math.min(scale.height - 12, scale.height - ratio * scale.height));
}

function normalizeClientScore(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) {
    return 0;
  }

  return Math.min(100, Math.max(0, Math.round(number)));
}

function buildKtvRecordingName(song) {
  const title = sanitizeRecordingName(song?.displayTitle || song?.fileStem || "song") || "song";
  return `${title}-${formatKtvTimestamp(new Date())}-sing`;
}

function sanitizeRecordingName(value) {
  return String(value || "")
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160);
}

function formatKtvTimestamp(date) {
  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}-${pad(
    date.getHours(),
  )}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
}

function getPlaylistById(playlistId) {
  return state.playlists.find((playlist) => playlist.id === Number(playlistId)) || null;
}

function getSongPlaylistMemberships(song) {
  if (!song) {
    return [];
  }

  const membershipsFromPlaylists = state.playlists
    .filter((playlist) => Array.isArray(playlist.songIds) && playlist.songIds.includes(song.id))
    .map((playlist) => ({
      id: playlist.id,
      name: playlist.name,
    }));

  if (membershipsFromPlaylists.length) {
    return membershipsFromPlaylists.sort(
      (left, right) => left.name.localeCompare(right.name) || left.id - right.id,
    );
  }

  return Array.isArray(song.playlists) ? song.playlists : [];
}

function getAvailablePlaylistsForSong(song) {
  if (!song) {
    return [];
  }

  const membershipIds = new Set(getSongPlaylistMemberships(song).map((playlist) => playlist.id));
  return state.playlists.filter((playlist) => !membershipIds.has(playlist.id));
}

function prunePlaylistDraftSelections() {
  for (const [songId, playlistId] of Object.entries(state.playlistDraftSelectionBySongId)) {
    const song = getSongById(Number(songId));
    const playlist = getPlaylistById(Number(playlistId));
    const membershipIds = new Set(getSongPlaylistMemberships(song).map((entry) => entry.id));

    if (!song || !playlist || membershipIds.has(Number(playlistId))) {
      delete state.playlistDraftSelectionBySongId[songId];
    }
  }
}

function resolvePlaylistSelection(song, availablePlaylists = getAvailablePlaylistsForSong(song)) {
  if (!song) {
    return "";
  }

  const storedSelection = state.playlistDraftSelectionBySongId[song.id];
  if (
    storedSelection &&
    availablePlaylists.some((playlist) => playlist.id === Number(storedSelection))
  ) {
    return String(storedSelection);
  }

  return "";
}

function getActiveLyricIndex(song, lineCount) {
  if (state.currentSongId !== song.id || !state.duration || lineCount <= 1) {
    return 0;
  }

  const progress = Math.max(0, Math.min(1, state.currentTime / state.duration));
  return Math.min(lineCount - 1, Math.floor(progress * lineCount));
}

function getTimedLyricIndex(lines) {
  if (!lines.length || !state.currentTime) {
    return 0;
  }

  let activeIndex = 0;
  for (let index = 0; index < lines.length; index += 1) {
    if (lines[index].time > state.currentTime + 0.12) {
      break;
    }

    activeIndex = index;
  }

  return activeIndex;
}

function parseTimedLyrics(lyrics) {
  const timedLines = [];
  const timestampPattern = /\[(\d{1,2}):(\d{2}(?:\.\d{1,3})?)\]/g;

  for (const rawLine of lyrics.split("\n")) {
    const matches = [...rawLine.matchAll(timestampPattern)];
    if (!matches.length) {
      continue;
    }

    const text = rawLine.replace(timestampPattern, "").trim();
    if (!text) {
      continue;
    }

    for (const match of matches) {
      timedLines.push({
        time: Number(match[1]) * 60 + Number(match[2]),
        text,
      });
    }
  }

  return timedLines.sort((left, right) => left.time - right.time);
}

function getSongTypeLabel(song) {
  const extension = pathExtension(song.fileName).replace(".", "").toUpperCase();
  return `${extension || "FILE"} / ${song.mediaKind}`;
}

function buildSongMetaLine(song) {
  return [song.artist || t("unknownArtist"), song.album || t("unsorted")].join(" / ");
}

function formatSongDuration(song) {
  const duration = state.durationCache[song.id];

  if (!Number.isFinite(duration) || duration <= 0) {
    return "--:--";
  }

  return formatTime(duration);
}

function buildTotalDurationLabel(songs) {
  const durations = songs.map((song) => state.durationCache[song.id]);
  if (!durations.length || durations.some((value) => !Number.isFinite(value) || value <= 0)) {
    return "--:--";
  }

  return formatTime(durations.reduce((sum, value) => sum + value, 0));
}

function formatTrackCount(count) {
  return state.language === "zh" ? `${count} ${t("trackUnit")}` : `${count} ${t("trackUnit")}`;
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return "0:00";
  }

  const totalSeconds = Math.floor(seconds);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const remainingSeconds = String(totalSeconds % 60).padStart(2, "0");

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${remainingSeconds}`;
  }

  return `${minutes}:${remainingSeconds}`;
}

function formatDate(date) {
  const locale = state.language === "zh" ? "zh-CN" : "en-US";
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

function pathExtension(fileName) {
  const index = fileName.lastIndexOf(".");
  return index === -1 ? "" : fileName.slice(index);
}

function wrapIndex(index, length) {
  if (!length) {
    return 0;
  }

  return ((index % length) + length) % length;
}

function buildQueueKey(queue) {
  return queue.map((song) => song.id).join(",");
}

function shuffleArray(items) {
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }

  return copy;
}

function buildInitials(value) {
  const text = String(value || "").trim();
  if (!text) {
    return "NP";
  }

  if (text.includes(" ")) {
    return text
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0] || "")
      .join("")
      .toUpperCase();
  }

  return Array.from(text).slice(0, 2).join("").toUpperCase();
}

function t(key) {
  return MESSAGES[state.language][key] || MESSAGES.en[key] || key;
}

function showToast(message) {
  if (!message) {
    return;
  }

  elements.toast.hidden = false;
  elements.toast.textContent = message;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    elements.toast.hidden = true;
  }, 2600);
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error || "Request failed.");
  }

  return payload;
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Unable to read the selected file."));
    reader.readAsDataURL(file);
  });
}

function loadStoredLanguage() {
  const stored = window.localStorage.getItem("78dlc-language");
  return stored === "zh" || stored === "en" ? stored : "en";
}

function loadStoredOfflineInfo() {
  try {
    const payload = JSON.parse(window.localStorage.getItem("78dlc-offline-info") || "{}");
    return {
      cachedCount: Number(payload.cachedCount) || 0,
      cachedBytes: Number(payload.cachedBytes) || 0,
      lastSavedAt: typeof payload.lastSavedAt === "string" ? payload.lastSavedAt : "",
    };
  } catch (_error) {
    return { cachedCount: 0, cachedBytes: 0, lastSavedAt: "" };
  }
}

function saveStoredOfflineInfo(info) {
  window.localStorage.setItem("78dlc-offline-info", JSON.stringify(info));
}

function loadStoredSidebarWidth() {
  const stored = Number(window.localStorage.getItem("78dlc-sidebar-width"));
  return Number.isFinite(stored) ? clampSidebarWidth(stored) : SIDEBAR_DEFAULT_WIDTH;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
