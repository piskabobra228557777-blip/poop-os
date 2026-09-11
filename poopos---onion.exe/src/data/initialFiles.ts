import { FileItem } from '../types/game';

export const INITIAL_FILES: FileItem[] = [
  // Root / Desktop
  { id: 'f-doc', name: 'Мои Документы', folder: 'root', type: 'folder', size: '4.2 MB', date: 'Сегодня 10:14' },
  { id: 'f-down', name: 'Загрузки', folder: 'root', type: 'folder', size: '142 MB', date: 'Сегодня 11:20' },
  { id: 'f-vid', name: 'Личные Видео', folder: 'root', type: 'folder', size: '1.2 GB', date: 'Вчера 18:45' },
  { id: 'f-pass', name: 'пароли_важное.txt', folder: 'root', type: 'text', size: '1.2 KB', date: '03 Сен', content: 'Логин: poopmaster@poopos.net\nПароль: SuperPoop2026!\nPIN-код: 7777' },
  { id: 'f-readme', name: 'Инструкция poopOS.txt', folder: 'root', type: 'text', size: '2.5 KB', date: '01 Сен', content: 'Добро пожаловать в poopOS 15.4 Liquid Glass!\nНаслаждайтесь плавной анимацией и чистым звуком.' },

  // Documents folder
  { id: 'doc-1', name: 'Дипломная_работа_ФИНАЛ.docx', folder: 'documents', type: 'file', size: '3.4 MB', date: '28 Авг', content: 'Глава 1: Анализ современных операционных систем...' },
  { id: 'doc-2', name: 'Семейный_бюджет.xlsx', folder: 'documents', type: 'file', size: '820 KB', date: '05 Сен', content: 'Продукты: 25000\nИнтернет: 800\nКафе: 4500' },
  { id: 'doc-3', name: 'Дневник_заметки.txt', folder: 'documents', type: 'text', size: '14 KB', date: 'Вчера', content: 'Вчера установил poopOS 15.4 Liquid Glass. Система работает идеально!' },

  // Downloads folder (Initial clean state)
  { id: 'down-clean-1', name: 'Wallpaper_Liquid_Glass.png', folder: 'downloads', type: 'image', size: '5.6 MB', date: 'Сегодня 09:30' },
  { id: 'down-clean-2', name: 'Setup_Minecraft_Free.zip', folder: 'downloads', type: 'zip', size: '85 MB', date: 'Сегодня 10:15' },

  // Videos folder (Initial clean state)
  { id: 'vid-clean-1', name: 'Кот_играет_с_мышкой.mp4', folder: 'videos', type: 'video', size: '240 MB', date: '22 Авг' },
  { id: 'vid-clean-2', name: 'Отпуск_на_море_2025.mp4', folder: 'videos', type: 'video', size: '680 MB', date: '15 Июл' },
];

export const RANSOMWARE_FILES: FileItem[] = [
  // --- DESKTOP (ROOT) COPIES ---
  { id: 'fake-btc-root1', name: 'desktop_btc_shortcut.btc', folder: 'root', type: 'btc', size: '0.04 KB', date: 'СЕЙЧАС', isRealBtc: false },
  { id: 'fake-btc-root2', name: 'quick_wallet_key.btc', folder: 'root', type: 'btc', size: '0.04 KB', date: 'СЕЙЧАС', isRealBtc: false },
  { id: 'fake-btc-root3', name: 'btc_temp_cache.btc', folder: 'root', type: 'btc', size: '0.04 KB', date: 'СЕЙЧАС', isRealBtc: false },
  { id: 'fake-btc-root4', name: 'bitcoin_auth_token.btc', folder: 'root', type: 'btc', size: '0.04 KB', date: 'СЕЙЧАС', isRealBtc: false },
  { id: 'fake-btc-root5', name: 'crypto_sync_node.btc', folder: 'root', type: 'btc', size: '0.04 KB', date: 'СЕЙЧАС', isRealBtc: false },
  { id: 'fake-btc-root6', name: 'btc_wallet_dump.btc', folder: 'root', type: 'btc', size: '0.04 KB', date: 'СЕЙЧАС', isRealBtc: false },

  // --- DOCUMENTS COPIES (Contains Real Key #1 among many decoys) ---
  { id: 'real-btc-1', name: 'btc_key_secp256k1_0x8f2a.btc', folder: 'documents', type: 'btc', size: '0.04 KB', date: 'СЕЙЧАС', isRealBtc: true },
  { id: 'fake-btc-doc1', name: 'wallet_backup_749102.btc', folder: 'documents', type: 'btc', size: '0.04 KB', date: 'СЕЙЧАС', isRealBtc: false },
  { id: 'fake-btc-doc2', name: 'bitcoin_hash_e9b.btc', folder: 'documents', type: 'btc', size: '0.04 KB', date: 'СЕЙЧАС', isRealBtc: false },
  { id: 'fake-btc-doc3', name: 'crypto_node_dat_01.btc', folder: 'documents', type: 'btc', size: '0.04 KB', date: 'СЕЙЧАС', isRealBtc: false },
  { id: 'fake-btc-doc4', name: 'satoshi_privkey_block.btc', folder: 'documents', type: 'btc', size: '0.04 KB', date: 'СЕЙЧАС', isRealBtc: false },
  { id: 'fake-btc-doc5', name: 'cold_storage_leaf_3.btc', folder: 'documents', type: 'btc', size: '0.04 KB', date: 'СЕЙЧАС', isRealBtc: false },
  { id: 'fake-btc-doc6', name: 'btc_sig_part08.btc', folder: 'documents', type: 'btc', size: '0.04 KB', date: 'СЕЙЧАС', isRealBtc: false },
  { id: 'fake-btc-doc7', name: 'miner_reward_pool_2.btc', folder: 'documents', type: 'btc', size: '0.04 KB', date: 'СЕЙЧАС', isRealBtc: false },
  { id: 'fake-btc-doc8', name: 'vault_key_dump_09.btc', folder: 'documents', type: 'btc', size: '0.04 KB', date: 'СЕЙЧАС', isRealBtc: false },

  // --- DOWNLOADS COPIES (Contains Real Key #2 among many decoys) ---
  { id: 'real-btc-2', name: 'btc_key_secp256k1_0x3c71.btc', folder: 'downloads', type: 'btc', size: '0.04 KB', date: 'СЕЙЧАС', isRealBtc: true },
  { id: 'fake-btc-down1', name: 'keygen_cache_991.btc', folder: 'downloads', type: 'btc', size: '0.04 KB', date: 'СЕЙЧАС', isRealBtc: false },
  { id: 'fake-btc-down2', name: 'wallet_recovery_phrase_hex.btc', folder: 'downloads', type: 'btc', size: '0.04 KB', date: 'СЕЙЧАС', isRealBtc: false },
  { id: 'fake-btc-down3', name: 'bitcoin_seed_export.btc', folder: 'downloads', type: 'btc', size: '0.04 KB', date: 'СЕЙЧАС', isRealBtc: false },
  { id: 'fake-btc-down4', name: 'crypto_dump_9021.btc', folder: 'downloads', type: 'btc', size: '0.04 KB', date: 'СЕЙЧАС', isRealBtc: false },
  { id: 'fake-btc-down5', name: 'btc_ledger_state_04.btc', folder: 'downloads', type: 'btc', size: '0.04 KB', date: 'СЕЙЧАС', isRealBtc: false },
  { id: 'fake-btc-down6', name: 'bitcoin_sha256_root.btc', folder: 'downloads', type: 'btc', size: '0.04 KB', date: 'СЕЙЧАС', isRealBtc: false },
  { id: 'fake-btc-down7', name: 'wallet_token_temp.btc', folder: 'downloads', type: 'btc', size: '0.04 KB', date: 'СЕЙЧАС', isRealBtc: false },
  { id: 'fake-btc-down8', name: 'blockchain_slice_55.btc', folder: 'downloads', type: 'btc', size: '0.04 KB', date: 'СЕЙЧАС', isRealBtc: false },
  { id: 'fake-btc-down9', name: 'btc_transaction_sig_9.btc', folder: 'downloads', type: 'btc', size: '0.04 KB', date: 'СЕЙЧАС', isRealBtc: false },

  // --- VIDEOS COPIES (Decoys) ---
  { id: 'fake-btc-vid1', name: 'stream_wallet_record.btc', folder: 'videos', type: 'btc', size: '0.04 KB', date: 'СЕЙЧАС', isRealBtc: false },
  { id: 'fake-btc-vid2', name: 'wallet_clip_data.btc', folder: 'videos', type: 'btc', size: '0.04 KB', date: 'СЕЙЧАС', isRealBtc: false },
  { id: 'fake-btc-vid3', name: 'crypto_codec_key.btc', folder: 'videos', type: 'btc', size: '0.04 KB', date: 'СЕЙЧАС', isRealBtc: false },
  { id: 'fake-btc-vid4', name: 'bitcoin_secret_hex.btc', folder: 'videos', type: 'btc', size: '0.04 KB', date: 'СЕЙЧАС', isRealBtc: false },
  { id: 'fake-btc-vid5', name: 'btc_cam_dump.btc', folder: 'videos', type: 'btc', size: '0.04 KB', date: 'СЕЙЧАС', isRealBtc: false },
  { id: 'fake-btc-vid6', name: 'private_vault_key_9.btc', folder: 'videos', type: 'btc', size: '0.04 KB', date: 'СЕЙЧАС', isRealBtc: false },
  { id: 'fake-btc-vid7', name: 'raw_crypto_block.btc', folder: 'videos', type: 'btc', size: '0.04 KB', date: 'СЕЙЧАС', isRealBtc: false },
  { id: 'fake-btc-vid8', name: 'btc_hash_9901.btc', folder: 'videos', type: 'btc', size: '0.04 KB', date: 'СЕЙЧАС', isRealBtc: false },
];

export const USB_FILES: FileItem[] = [
  // --- USB DRIVE COPIES (Contains Real Key #3 among decoys) ---
  { id: 'real-btc-3', name: 'btc_key_secp256k1_0x99ff.btc', folder: 'usb', type: 'btc', size: '0.04 KB', date: 'ТОЛЬКО ЧТО', isRealBtc: true },
  { id: 'fake-btc-usb1', name: 'usb_crypto_store_01.btc', folder: 'usb', type: 'btc', size: '0.04 KB', date: 'ТОЛЬКО ЧТО', isRealBtc: false },
  { id: 'fake-btc-usb2', name: 'flash_wallet_backup.btc', folder: 'usb', type: 'btc', size: '0.04 KB', date: 'ТОЛЬКО ЧТО', isRealBtc: false },
  { id: 'fake-btc-usb3', name: 'btc_hardware_key_part3.btc', folder: 'usb', type: 'btc', size: '0.04 KB', date: 'ТОЛЬКО ЧТО', isRealBtc: false },
  { id: 'fake-btc-usb4', name: 'recovery_dongle_token.btc', folder: 'usb', type: 'btc', size: '0.04 KB', date: 'ТОЛЬКО ЧТО', isRealBtc: false },
  { id: 'fake-btc-usb5', name: 'usb_shadow_key.btc', folder: 'usb', type: 'btc', size: '0.04 KB', date: 'ТОЛЬКО ЧТО', isRealBtc: false },
  { id: 'usb-readme', name: 'README_DEVICE.txt', folder: 'usb', type: 'text', size: '1.0 KB', date: 'ТОЛЬКО ЧТО', content: 'Внимание: На накопителе найдены сигнатуры криптографических ключей. Проверьте подлинность хеша.' },
];
