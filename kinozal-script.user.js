// ==UserScript==
// @name Kinozal | Rutor | Rutracker / Кнопки скачивания (Torrent|Magnet|TorrServer)2
// @description v1.2 (Обновлен полностью скрипт)2
// @namespace none
// @version 1.2
// @author https://greasyfork.org/ru/users/173690
// @author https://greasyfork.org/scripts/39242
// @icon data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAQCAMAAAD+iNU2AAAAD1BMVEU7R4CAAAD4+/z9787///8A0Su5AAAASUlEQVR4AXWPAQrEMBACzen/33wdkGILFZQdSFxWkZKoyWBsd5JXvFgMfC6ZLBs0pq8Mtq8f0Bcbw9N3HvuI8i14sAt/e8/73j/4FwHuDyR5AQAAAABJRU5ErkJggg==
// @include /^(https?:\/\/)?(www\.)?kinozal(\.me|\.tv|\.guru|\.website|tv\.life)\/*/
// @include /^(https?:\/\/)?(www\.)?rutor\.(info|is)\/*/
// @include /^(https?:\/\/)?(www\.)?kinopoisk\.ru\/*/
// @include /^(https?:\/\/)?(www\.)?rutracker\.org\/*/
// @require https://cdn.jsdelivr.net/npm/sweetalert2@10/dist/sweetalert2.all.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/mark.js/8.11.1/mark.min.js
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_addStyle
// @grant GM_registerMenuCommand
/* globals $ */
// ==/UserScript==
(function ()
{
	'use strict';
	var script_version = "v1.2",
		match_no_ads = /без.*?реклам|реклам.*?нет|реклам.*?отсутствует|дублированный|лицензия|netflix|itunes|hdrezka|ironclub|appletv/g,
		match_with_ads = /содержит.*?реклам|реклам.*?вставк|есть реклама|присутствуе.*?реклам|реклама.*?присутствует/g;

	function MonkeyConfig()
	{
		var cfg = this,
			data, params, values = {},
			storageKey, displayed, openWin, openLayer, container, overlay;

		function init(newData)
		{
			data = newData;
			if (data)
			{
				params = data.parameters || data.params;
				if (data.buttons === undefined) data.buttons = ['save', 'defaults', 'cancel'];
				if (data.width === undefined) data.width = '650px';
				if (data.scriptname === undefined) data.scriptname = 'KinozalCFG';
				if (data.title === undefined)
					if (typeof GM_getMetadata == 'function')
					{
						var scriptName = GM_getMetadata('name');
						data.title = scriptName + ' Configuration';
					}
				else data.title = 'Configuration';
			}
			var safeTitle = data && data.scriptname ? data.scriptname.replace(/[^a-zA-Z0-9]/g, '_') : '';
			storageKey = 'ScriptSettings_' + safeTitle + '_cfg';
			var storedValues;
			if (GM_getValue(storageKey)) storedValues = JSON.parse(GM_getValue(storageKey));
			for (var name in params)
			{
				if (params[name]['value'] !== undefined) set(name, params[name].value);
				else if (storedValues && storedValues[name] !== undefined) set(name, storedValues[name]);
				else if (params[name]['default'] !== undefined) set(name, params[name]['default']);
				else set(name, '');
			}
			if (data.menuCommand)
			{
				var caption = data.menuCommand !== true ? data.menuCommand : data.title;
				GM_registerMenuCommand(caption, function ()
				{
					cfg.open();
				});
			}
			cfg.open = open;
			cfg.close = close;
			cfg.get = get;
			cfg.set = function (name, value)
			{
				set(name, value);
				update();
			};
		}

		function get(name)
		{
			return values[name];
		}

		function set(name, value)
		{
			values[name] = value;
		}

		function setDefaults()
		{
			for (var name in params)
			{
				if (typeof params[name]['default'] !== 'undefined')
				{
					set(name, params[name]['default']);
				}
			}
		}

		function render()
		{
			var html = '<div class="ScriptSettingsContainer"><h1 class="swal-settings-maintitle">' + data.title + '</h1><table style="width: 100%;" cellspacing="0" cellpadding="0">';
			for (var name in params)
			{
				html += MonkeyConfig.formatters['tr'](name, params[name]);
			}
			html += '<tr><th colspan="2" class="swal-settings-buttons">';
			for (var button in data.buttons)
			{
				switch (data.buttons[button])
				{
				case 'cancel':
					html += '<button type="button" class="btn_normal btn_cred MT6" id="ScriptSettingsButton_cancel">Отмена</button>';
					break;
				case 'defaults':
					html += '<button type="button" class="btn_normal btn_cblue MT6" id="ScriptSettingsButton_defaults">Ст. Наст.</button>';
					break;
				case 'save':
					html += '<button type="button" class="btn_normal btn_cblue MT6" id="ScriptSettingsButton_save">Сохранить</button>';
					break;
				}
			}
			html += "</th></tr></table><div>";
			return html;
		}

		function update()
		{
			if (!displayed) return;
			for (var name in params)
			{
				var value = values[name];
				switch (params[name].type)
				{
				case 'checkbox':
					var elem = container.querySelector('[name="' + name + '"]');
					elem.checked = !!value;
					break;
				case 'custom':
					params[name].set(value, container.querySelector('#ScriptSettingsParent_' + name));
					break;
				case 'number':
				case 'text':
				case 'color':
					var elem = container.querySelector('[name="' + name + '"]');
					elem.value = value;
					break;
				case 'select':
					var elem = container.querySelector('[name="' + name + '"]');
					if (elem.tagName.toLowerCase() == 'input')
					{
						if (elem.type && elem.type == 'radio')
						{
							elem = container.querySelector('[name="' + name + '"][value="' + value + '"]');
							elem.checked = true;
						}
						else if (elem.type && elem.type == 'checkbox')
						{
							var checkboxes = container.querySelectorAll('input[name="' + name + '"]');
							for (var i = 0; i < checkboxes.length; i++) checkboxes[i].checked = (value.indexOf(checkboxes[i].value) > -1);
						}
					}
					else if (elem.tagName.toLowerCase() == 'select')
						if (elem.multiple)
						{
							var options = container.querySelectorAll('select[name="' + name + '"] option');
							for (var i = 0; i < options.length; i++) options[i].selected = (value.indexOf(options[i].value) > -1);
						}
					else elem.value = value;
					break;
				}
			}
		}

		function saveClick()
		{
			for (var name in params)
			{
				switch (params[name].type)
				{
				case 'checkbox':
					var elem = container.querySelector('[name="' + name + '"]');
					values[name] = elem.checked;
					break;
				case 'custom':
					values[name] = params[name].get(container.querySelector('#ScriptSettingsParent_' + name));
					break;
				case 'number':
				case 'text':
				case 'color':
					var elem = container.querySelector('[name="' + name + '"]');
					values[name] = elem.value;
					break;
				case 'select':
					var elem = container.querySelector('[name="' + name + '"]');
					if (elem.tagName.toLowerCase() == 'input')
					{
						if (elem.type && elem.type == 'radio') values[name] = container.querySelector('[name="' + name + '"]:checked').value;
						else if (elem.type && elem.type == 'checkbox')
						{
							values[name] = [];
							var inputs = container.querySelectorAll('input[name="' + name + '"]');
							for (var i = 0; i < inputs.length; i++)
								if (inputs[i].checked) values[name].push(inputs[i].value);
						}
					}
					else if (elem.tagName.toLowerCase() == 'select' && elem.multiple)
					{
						values[name] = [];
						var options = container.querySelectorAll('select[name="' + name + '"] option');
						for (var i = 0; i < options.length; i++)
							if (options[i].selected) values[name].push(options[i].value);
					}
					else values[name] = elem.value;
					break;
				}
			}
			GM_setValue(storageKey, JSON.stringify(values));
			close();
			if (data.onSave) data.onSave(values);
		}

		function cancelClick()
		{
			Swal.close();
		}

		function defaultsClick()
		{
			setDefaults();
			update();
		}

		function open(mode, options)
		{
			function openDone()
			{
				var button;
				if (button = container.querySelector('#ScriptSettingsButton_save')) button.addEventListener('click', saveClick, true);
				if (button = container.querySelector('#ScriptSettingsButton_cancel')) button.addEventListener('click', cancelClick, true);
				if (button = container.querySelector('#ScriptSettingsButton_defaults')) button.addEventListener('click', defaultsClick, true);
				displayed = true;
				update();
			}
			switch (mode)
			{
			default:
				Swal.fire(
				{
					width: data.width,
					html: render(),
					showCancelButton: false,
					showConfirmButton: false,
					didOpen: () =>
					{
						Swal.getContent().querySelector('button#ScriptSettingsButton_save').focus();
					}
				});
				container = document.querySelector('.ScriptSettingsContainer');
				openDone();
				break;
			}
		}

		function close()
		{
			if (openWin)
			{
				openWin.close();
				openWin = undefined;
			}
			else if (openLayer)
			{
				openLayer.parentNode.removeChild(openLayer);
				openLayer = undefined;
				if (overlay)
				{
					overlay.parentNode.removeChild(overlay);
					overlay = undefined;
				}
			}
			displayed = false;
		}
		init(arguments[0]);
	}
	MonkeyConfig.esc = function (string)
	{
		return string.replace(/"/g, '&quot;');
	};
	MonkeyConfig.HTML = {
		'_field': function (name, options, data)
		{
			var html;
			if (options.type && MonkeyConfig.HTML[options.type]) html = MonkeyConfig.HTML[options.type](name, options, data);
			else return;
			if (/\[FIELD\]/.test(options.html))
			{
				html = options.html.replace(/\[FIELD\]/, html);
			}
			return html;
		},
		'_label': function (name, options, data)
		{
			var label = options['label'] || name.substring(0, 1).toUpperCase() + name.substring(1).replace(/_/g, '&nbsp;');
			return '<label for="ScriptSettings_field_' + name + '" class="swal-settings-label">' + label + '</label>';
		},
		'_title': function (name, options)
		{
			var title = (options['title'] != undefined ? '<th colspan="2" class="swal-settings-title">' + options['title'] + '</th></tr><tr>' : '');
			return title;
		},
		'checkbox': function (name, options, data)
		{
			return '<label class="checkboxToggle"><input id="ScriptSettings_field_' + name + '" name="' + name + '" type="checkbox"><b></b></label>';
		},
		'custom': function (name, options, data)
		{
			return options.html;
		},
		'number': function (name, options, data)
		{
			return '<input id="ScriptSettings_field_' + name + '" type="text" class="ScriptSettings_field_number" name="' + name + '" />';
		},
		'select': function (name, options, data)
		{
			var choices = {},
				html = '';
			if (options.choices.constructor == Array)
			{
				for (var i = 0; i < options.choices.length; i++) choices[options.choices[i]] = options.choices[i];
			}
			else choices = options.choices;
			if (!options.multiple)
			{
				if (!/^radio/.test(options.variant))
				{
					html += '<select id="ScriptSettings_field_' + name + '" class="swal-settings-select" name="' + name + '">';
					for (var value in choices) html += '<option value="' + MonkeyConfig.esc(value) + '">' + choices[value] + '</option>';
					html += '</select>';
				}
				else
				{
					for (var value in choices)
					{
						html += '<label><input type="radio" name="' + name + '" value="' + MonkeyConfig.esc(value) + '" />&nbsp;' + choices[value] + '</label>' + (/ column/.test(options.variant) ? '<br />' : '');
					}
				}
			}
			else
			{
				if (!/^checkbox/.test(options.variant))
				{
					html += '<select id="ScriptSettings_field_' + name + '" class="ScriptSettings_field_select" multiple="multiple" name="' + name + '">';
					for (var value in choices) html += '<option value="' + MonkeyConfig.esc(value) + '">' + choices[value] + '</option>';
					html += '</select>';
				}
				else
				{
					for (var value in choices)
					{
						html += '<label><input type="checkbox" name="' + name + '" value="' + MonkeyConfig.esc(value) + '" />&nbsp;' + choices[value] + '</label>' + (/ column/.test(options.variant) ? '<br />' : '');
					}
				}
			}
			return html;
		},
		'text': function (name, options, data)
		{
			if (options.long) return '<textarea id="ScriptSettings_field_' + name + '" class="swal-settings-textarea" ' + (!isNaN(options.long) ? 'rows="' + options.long + '" ' : '') + 'name="' + name + '"></textarea>';
			else return '<input id="ScriptSettings_field_' + name + '" type="text" class="swal-settings-input" name="' + name + '" />';
		},
		'color': function (name, options, data)
		{
			return '<input id="ScriptSettings_field_' + name + '" type="color" class="swal-settings-color" name="' + name + '" />';
		}
	};
	MonkeyConfig.formatters = {
		'tr': function (name, options, data)
		{
			var html = '<tr>';
			switch (options.type)
			{
			default:
				html += MonkeyConfig.HTML['_title'](name, options, data);
				html += '<td>';
				html += MonkeyConfig.HTML['_label'](name, options, data);
				html += '</td><td id="ScriptSettingsParent_' + name + '">';
				html += MonkeyConfig.HTML['_field'](name, options, data);
				html += '</td>';
				break;
			}
			html += '</tr>';
			return html;
		}
	};

	function copy(str)
	{
		var tmp = document.createElement('textarea'),
			focus = document.activeElement;
		tmp.value = str;
		document.body.appendChild(tmp);
		tmp.select();
		document.execCommand('copy');
		document.body.removeChild(tmp);
		focus.focus();
	}

	function truncString(str, max, add)
	{
		add = add || '...';
		return (typeof str === 'string' && str.length > max ? str.substring(0, max) + add : str);
	};

	function declOfNum(n, text_forms)
	{
		var get_number = n;
		n = Math.abs(n) % 100;
		var n1 = n % 10;
		if (n > 10 && n < 20)
		{
			return get_number + " " + text_forms[2];
		}
		if (n1 > 1 && n1 < 5)
		{
			return get_number + " " + text_forms[1];
		}
		if (n1 == 1)
		{
			return get_number + " " + text_forms[0];
		}
		return get_number + " " + text_forms[2];
	}

	function SwallAutoCloseMsg(GetTitle, GetTimer)
	{
		let timerInterval;
		Swal.fire(
		{
			timer: GetTimer * 1000,
			html: "<center><h2 class=\"swal2-title\" style=\"font-size: 18px;\">" + GetTitle + "</h2><br>Окно автоматически закроется через <b></b> сек</center>",
			position: "center",
			showConfirmButton: false,
			timerProgressBar: true,
			didOpen: () =>
			{
				timerInterval = setInterval(() =>
				{
					const content = Swal.getHtmlContainer()
					if (content)
					{
						const b = content.querySelector('b')
						if (b)
						{
							b.textContent = Math.ceil(swal.getTimerLeft() / 1000);
						}
					}
				}, 100)
			},
			willClose: () =>
			{
				clearInterval(timerInterval)
			}
		})
	}

	function fixedEncodeURIComponent(str)
	{
		return encodeURIComponent(str).replace(/[!'()*]/g, function (c)
		{
			return '%' + c.charCodeAt(0).toString(16);
		});
	}

	function spoilerblock(title = null, content, show = "close", titlecolor = "royalblue")
	{
		var display = "",
			hint = "";
		if (show == "close")
		{
			display = 'style="display: none;"';
			hint = 'Открыть';
		}
		else if (show == "open")
		{
			display = 'style="display: block;"';
			hint = 'Закрыть';
		}
		return ('<div class="spoilerButton ' + show + '" title="' + hint + '"><div class="block-title"><span style="color:' + titlecolor + '">' + title.toUpperCase() + '</span></div></div><div ' + display + '><div class="spoiler-body">' + content + '</div></div>');
	}
	async function windows1251ResponseToUTF8Response(response)
	{
		return new Response(new TextDecoder("windows-1251").decode(await response.arrayBuffer()));
	}
	var reg_kinozal_search = new RegExp('kinozal(.me|.tv|.guru|.website|tv.life)\/(browse.php|persons.php.*torr$|groupexreleaselist.php|groupex.php|groupextorrentlist.php)', 'i'),
		reg_kinozal_detailed = new RegExp('kinozal(.me|.tv|.guru|.website|tv.life)\/(details|comment).php', 'i'),
		reg_kinozal_top = new RegExp('kinozal(.me|.tv|.guru|.website|tv.life)\/(top.php|novinki.php|persons.php.*torrtop$)', 'i'),
		reg_rutor_list = new RegExp('rutor.(info|is)\/', 'i'),
		reg_kinopoisk_like = new RegExp('kinopoisk.ru\/(film|series)\/[0-9]+\/like', 'i'),
		reg_kinopoisk_main = new RegExp('kinopoisk.ru\/(film|series)\/[0-9]+\/', 'i'),
		reg_rutracker = new RegExp('rutracker.org\/forum\/', 'i'),
		TorrServerCFG = new MonkeyConfig(
		{
			width: "auto",
			scriptname: "torrserver",
			title: "Настройка TorrServer (" + script_version + ")",
			menuCommand: false,
			params:
			{
				TorrServerVersion:
				{
					title: "TorrServer",
					label: "Версия",
					type: 'select',
					choices:
					{
						"new": '1.2.xx / Matrix',
						"old": '< 1.1.xx',
					},
					default: 'new'
				},
				TorrServerIP:
				{
					label: "IP сервера<p>В параметрах расширения необходимо указать сетевой адрес вашего торрсервера<br>( Например <b>http://192.168.0.122:8090/</b>, <b>http://localhost:8090/</b>.)<br><b>Примечание!</b> Возможна блокировка запросов со стороны<br>(uBlock, adblock и т.п. програм) при добавлении раздачи.<br>смотрите в описании скрипта</p>",
					type: 'text',
					default: "http://127.0.0.1:8090/"
				}
			},
			onSave: function (values)
			{
				location.reload();
			}
		}),
		KinozalCFG = new MonkeyConfig(
		{
			width: "auto",
			scriptname: "kinozal",
			title: "Настройка скрипта (" + script_version + ")",
			menuCommand: false,
			params:
			{
				DetailedInfoButtons:
				{
					title: "Кнопки<p>( Внутри раздачи )</p>",
					label: "Сделать простыми кнопки скачивания?",
					type: 'checkbox',
					default: false
				},
				ShowConfirmDownload:
				{
					title: "Кнопки<p>( Поиск / Раздачи персоны / Внутри раздачи )</p>",
					label: "<b>Подтверждение действия кнопок при нажатии</b><p style=\"color:red\">ТОРРЕНТ, MAGNET, TORRSERVER</p>",
					type: 'checkbox',
					default: true
				},
				ShowTorrentButton:
				{
					label: "Кнопка \"<b>СКАЧАТЬ ТОРРЕНТ ФАЙЛ</b>\"<p>Данный метод может повлиять на ваш рейтинг</p>",
					type: 'checkbox',
					default: true
				},
				ShowMagnetButton:
				{
					label: "Кнопка \"<b>СКАЧАТЬ ЧЕРЕЗ MAGNET</b>\"<p>Данный метод скачивания не затрагивает ваш профиль</p>",
					type: 'checkbox',
					default: true
				},
				ShowCopyMagnetButton:
				{
					label: "Кнопка \"<b>СКОПИРОВАТЬ MAGNET ССЫЛКУ</b>\"",
					type: 'checkbox',
					default: true
				},
				ShowTorrServerButton:
				{
					label: "Кнопка \"<b>ДОБАВИТЬ РАЗДАЧУ В TORRSERVER</b>\"",
					type: 'checkbox',
					default: false
				},
				ChangeButtonToLink:
				{
					title: "Настройка ссылок<p>( Поиск / Раздачи персоны )</p>",
					label: "Выберите вариант:<p><b>ВКЛ</b> При нажатии главной ссылки, откроется окошко с кнопками скачивания<br><b>ВЫКЛ</b> Создаст отдельные кнопки для скачивания</p>",
					type: 'checkbox',
					default: false
				},
				ChangePersonLinks:
				{
					label: "При нажатии на имя персонажа (В окошке с информацией):<p><b>ВКЛ</b> Откроет страницу поиска с персонажем<br><b>ВЫКЛ</b> Откроет страницу персонажа</p>",
					type: 'checkbox',
					default: false
				},
				ShowMarkTorrents:
				{
					title: "Метки<p>( Поиск / Раздачи персоны )</p>",
					label: "Помечать раздачи",
					type: 'checkbox',
					default: true
				},
				MarkColor:
				{
					label: "Главный Цвет",
					type: 'color',
					default: "#ff6666"
				},
				MarkBolder:
				{
					label: "Обводка текста<p style=\"font-size:11px;\">Делает чуть жирнее текст</p>",
					type: 'checkbox',
					default: false
				},
				MarkBoldColor:
				{
					label: "Цвет обводки",
					type: 'color',
					default: "#750000"
				},
				MarkTextValue:
				{
					label: "Текст метки <b>через пробел</b>",
					type: 'text',
					default: "4K 2160P 1080P BDRIP"
				},
				SwalDetailedInfoWidth:
				{
					title: "Главное окно информации",
					label: "Ширина окна (<b>%</b> или <b>px</b>)<p style=\"font-size:11px;\">Пример <b>1000px</b> или <b>100%</b></p>",
					type: 'text',
					default: "1100px"
				},
				SwalDefaultStyle:
				{
					label: "Выберите стиль главного окна информации",
					type: 'select',
					choices:
					{
						"1": "Bootstrap-4",
						"2": "Borderless",
						"3": "Bulma",
						"4": "Default",
						"5": "Material UI",
						"6": "Minimal",
					},
					default: 4
				},
				KinopoiskLinkSearch:
				{
					title: "КиноПоиск<p>( Похожие фильмы\\сериалы )</p>",
					label: "Кнопка в кинопоиске<p>Выберите каким кинозалом вы пользуетесь,<br>что бы при нажатии на кнопку, открывался ваш кинозал</p>",
					type: 'select',
					choices:
					{
						kinozal1: 'kinozal.tv',
						kinozal2: 'kinozal.me',
						kinozal3: 'kinozal.guru',
						kinozal4: 'kinozaltv.life',
					},
					default: 'kinozal1'
				},
			},
			onSave: function (values)
			{
				location.reload();
			}
		}),
		RutorCFG = new MonkeyConfig(
		{
			width: "auto",
			scriptname: "rutor",
			title: "Настройка скрипта (" + script_version + ")",
			menuCommand: false,
			params:
			{
				ShowInfoButton:
				{
					title: "Кнопки",
					label: "Выберите вариант:<p><b>ВЫКЛ</b> Создаст отдельную кнопку для открытия окна с информацией<br><b>ВКЛ</b> При нажатии главной ссылки, откроется окошко с информацией</p>",
					type: 'checkbox',
					default: false
				},
				ShowConfirmDownload:
				{
					label: "<b>Подтверждение действия кнопок</b><p style=\"color:red\">ТОРРЕНТ, MAGNET, TORRSERVER</p>",
					type: 'checkbox',
					default: true
				},
				ShowTorrentButton:
				{
					label: "Кнопка \"<b>СКАЧАТЬ ТОРРЕНТ ФАЙЛ</b>\"",
					type: 'checkbox',
					default: true
				},
				ShowMagnetButton:
				{
					label: "Кнопка \"<b>СКАЧАТЬ ЧЕРЕЗ MAGNET</b>\"",
					type: 'checkbox',
					default: false
				},
				ShowCopyMagnetButton:
				{
					label: "Кнопка \"<b>СКОПИРОВАТЬ MAGNET ССЫЛКУ</b>\"",
					type: 'checkbox',
					default: false
				},
				ShowTorrServerButton:
				{
					label: "Кнопка \"<b>ДОБАВИТЬ РАЗДАЧУ В TORRSERVER</b>\"",
					type: 'checkbox',
					default: false
				},
				FontSize:
				{
					title: "Настройка шрифта",
					label: "Размер шрифта раздач",
					type: 'select',
					choices:
					{
						"12": "12px",
						"14": "14px",
						"16": "16px",
						"18": "18px",
						"20": "20px",
						"22": "22px",
					},
					default: 12
				},
				SwalDetailedInfoWidth:
				{
					title: "Настройка главного окна информации",
					label: "Ширина окна (<b>%</b> или <b>px</b>)<p style=\"font-size:11px;\">Пример <b>1000px</b> или <b>100%</b></p>",
					type: 'text',
					default: "1100px"
				},
				SwalDefaultStyle:
				{
					label: "Выберите стиль главного окна информации",
					type: 'select',
					choices:
					{
						"1": "Bootstrap-4",
						"2": "Borderless",
						"3": "Bulma",
						"4": "Default",
						"5": "Material UI",
						"6": "Minimal",
					},
					default: 4
				},
			},
			onSave: function (values)
			{
				location.reload();
			}
		}),
		RuTrackerCFG = new MonkeyConfig(
		{
			width: "auto",
			scriptname: "rutracker",
			title: "Настройка скрипта (" + script_version + ")",
			menuCommand: false,
			params:
			{
				ShowConfirmDownload:
				{
					title: "Кнопки",
					label: "<b>Подтверждение действия кнопок</b><p style=\"color:red\">ТОРРЕНТ, MAGNET, TORRSERVER</p>",
					type: 'checkbox',
					default: true
				},
				ShowInfoButton:
				{
					label: "Кнопка \"<b>ИНФО</b>\"<p style=\"color:red\">Показывает окошко с информацией о раздаче</p>",
					type: 'checkbox',
					default: true
				},
				ShowTorrentButton:
				{
					label: "Кнопка \"<b>СКАЧАТЬ ТОРРЕНТ ФАЙЛ</b>\"",
					type: 'checkbox',
					default: true
				},
				ShowMagnetButton:
				{
					label: "Кнопка \"<b>СКАЧАТЬ ЧЕРЕЗ MAGNET</b>\"",
					type: 'checkbox',
					default: true
				},
				ShowCopyMagnetButton:
				{
					label: "Кнопка \"<b>СКОПИРОВАТЬ MAGNET ССЫЛКУ</b>\"",
					type: 'checkbox',
					default: true
				},
				ShowTorrServerButton:
				{
					label: "Кнопка \"<b>ДОБАВИТЬ РАЗДАЧУ В TORRSERVER</b>\"<p style=\"color:red\">При нажатии кнопки, смотрите что вы добавляете</b></p>",
					type: 'checkbox',
					default: false
				},
				SwalDetailedInfoWidth:
				{
					title: "Настройка главного окна информации",
					label: "Ширина окна (<b>%</b> или <b>px</b>)<p style=\"font-size:11px;\">Пример <b>1000px</b> или <b>100%</b></p>",
					type: 'text',
					default: "1100px"
				},
				SwalDefaultStyle:
				{
					label: "Выберите стиль главного окна информации",
					type: 'select',
					choices:
					{
						"1": "Bootstrap-4",
						"2": "Borderless",
						"3": "Bulma",
						"4": "Default",
						"5": "Material UI",
						"6": "Minimal",
					},
					default: 4
				},
			},
			onSave: function (values)
			{
				location.reload();
			}
		});
	var TorrServerIP = TorrServerCFG.get('TorrServerIP'),
		TSVersion = TorrServerCFG.get('TorrServerVersion'),
		get_url = location.href,
		get_full_url = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : ''),
		KZ_SwalDefaultStyle = KinozalCFG.get('SwalDefaultStyle'),
		RUTOR_SwalDefaultStyle = RutorCFG.get('SwalDefaultStyle'),
		RT_SwalDefaultStyle = RuTrackerCFG.get('SwalDefaultStyle');

	function TS_POST(page, Data, getresponse)
	{
		fetch(TorrServerIP + page,
		{
			method: 'POST',
			body: Data
		}).then((response) => response.text()).then((text) => text.trim()).then(getresponse).catch((e) =>
		{
			SwallAutoCloseMsg("Не удалось отправить запрос на " + TorrServerIP, "5");
		});
	}
	if (/kinozal(.me|.tv|.guru|.website|tv.life)\//.test(get_url) && !/kinozal(.me|.tv|.guru|.website|tv.life)\/get_srv_details.php/.test(get_url))
	{
		var get_acc_login_check = $("#main")[0].innerText;
		if (get_acc_login_check.match(/\( Выход \)/) !== null)
		{
			var KZ_ChangeButtonToLink = KinozalCFG.get('ChangeButtonToLink');
			var KZ_ChangePersonLinks = KinozalCFG.get('ChangePersonLinks');
			var KZ_ShowTorrentButton = KinozalCFG.get('ShowTorrentButton');
			var KZ_ShowTorrServerButton = KinozalCFG.get('ShowTorrServerButton');
			var KZ_ShowMagnetButton = KinozalCFG.get('ShowMagnetButton');
			var KZ_ShowCopyMagnetButton = KinozalCFG.get('ShowCopyMagnetButton');
			var KZ_ShowMarkTorrents = KinozalCFG.get('ShowMarkTorrents');
			var KZ_MarkTextValue = KinozalCFG.get('MarkTextValue');
			var KZ_MarkBolder = KinozalCFG.get('MarkBolder');
			var KZ_MarkColorValue = KinozalCFG.get('MarkColor');
			var KZ_MarkBoldColorValue = KinozalCFG.get('MarkBoldColor');
			var KZ_SwalDetailedInfoWidth = KinozalCFG.get('SwalDetailedInfoWidth');
			var KZ_ShowConfirmDownload = KinozalCFG.get('ShowConfirmDownload');
			var KZ_DetailedInfoButtons = KinozalCFG.get('DetailedInfoButtons');
			if (KZ_SwalDefaultStyle == 1)
			{
				GM_addStyle('@import "https://cdn.jsdelivr.net/npm/@sweetalert2/theme-bootstrap-4/bootstrap-4.min.css";');
			}
			else if (KZ_SwalDefaultStyle == 2)
			{
				GM_addStyle('@import "https://cdn.jsdelivr.net/npm/@sweetalert2/theme-borderless/borderless.min.css";.swal2-container.swal2-backdrop-show, .swal2-container.swal2-noanimation {background: rgb(255 255 255);}.swal2-title {color: #000;}');
			}
			else if (KZ_SwalDefaultStyle == 3)
			{
				GM_addStyle('@import "https://cdn.jsdelivr.net/npm/@sweetalert2/theme-bulma/bulma.min.css";');
			}
			else if (KZ_SwalDefaultStyle == 4)
			{
				GM_addStyle('@import "https://cdn.jsdelivr.net/npm/@sweetalert2/theme-default/default.min.css";');
			}
			else if (KZ_SwalDefaultStyle == 5)
			{
				GM_addStyle('@import "https://cdn.jsdelivr.net/npm/@sweetalert2/theme-material-ui/material-ui.min.css";');
			}
			else if (KZ_SwalDefaultStyle == 6)
			{
				GM_addStyle('@import "https://cdn.jsdelivr.net/npm/@sweetalert2/theme-minimal/minimal.min.css";');
			}
			$('div#header .menu ul').append(`
<li><a href="javascript:void(0);" id="kinozal_settings" title="Настройка скрипта"><i class="fa fa-cogs"></i> Настройки</a></li>
${(KZ_ShowTorrServerButton === true ? '<li><a href="javascript:void(0);" id="torrserver_settings" title="Настройка TorrServer"><i class="fa fa-cogs"></i> TorrServer</a></li>' : "")}
`);
			$("div#header .menu ul li a#kinozal_settings").click(function ()
			{
				GM_addStyle(".swal-settings-label {cursor: pointer;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;font-size: 12px;display: block;padding: 6px 10px;}.swal-settings-label p {font-size: 11px;margin: 0px 0px 0px 0px;padding: 2px 0px 0px 0px;}.swal-settings-select:focus, .swal-settings-color:focus, .swal-settings-input:focus, .swal-settings-textarea:focus {border: 1px solid rgb(100 160 224);outline: 0;box-shadow: 0 0 0 3px rgb(85 142 202 / 50%);}.swal-settings-select, .swal-settings-input, .swal-settings-textarea {transition: border-color .3s,box-shadow .3s;border: 1px solid #767676;font-size: 14px;padding: 4px;margin: 0px 5px 0px 0px;border-radius: 5px;width: auto;}.swal-settings-color {transition: border-color .3s,box-shadow .3s;margin: 0px;border-radius: 5px;width: 30px;height: 30px;}.swal-settings-buttons{text-align: center;}.swal-settings-title {padding: 4px 0px;font-size: 14px;font-weight: bold;text-align: center;}.swal-settings-title p {font-size: 11px;font-weight: bold;}.swal-settings-maintitle{position: relative;max-width: 100%;padding: 0px;color: #ff0000;font-size: 12px;font-weight: bold;text-align: center;text-transform: none;}*, *::before, *::after {box-sizing: unset;}");
				KinozalCFG.open();
			});
			$("div#header .menu ul li a#torrserver_settings").click(function ()
			{
				GM_addStyle(".swal-settings-label {cursor: pointer;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;font-size: 12px;display: block;padding: 6px 10px;}.swal-settings-label p {font-size: 11px;margin: 0px 0px 0px 0px;padding: 2px 0px 0px 0px;}.swal-settings-select:focus, .swal-settings-color:focus, .swal-settings-input:focus, .swal-settings-textarea:focus {border: 1px solid rgb(100 160 224);outline: 0;box-shadow: 0 0 0 3px rgb(85 142 202 / 50%);}.swal-settings-select, .swal-settings-input, .swal-settings-textarea {transition: border-color .3s,box-shadow .3s;border: 1px solid #767676;font-size: 14px;padding: 4px;margin: 0px 5px 0px 0px;border-radius: 5px;width: auto;}.swal-settings-color {transition: border-color .3s,box-shadow .3s;margin: 0px;border-radius: 5px;width: 30px;height: 30px;}.swal-settings-buttons{text-align: center;}.swal-settings-title {padding: 4px 0px;font-size: 14px;font-weight: bold;text-align: center;}.swal-settings-title p {font-size: 11px;font-weight: bold;}.swal-settings-maintitle{position: relative;max-width: 100%;padding: 0px;color: #ff0000;font-size: 12px;font-weight: bold;text-align: center;text-transform: none;}*, *::before, *::after {box-sizing: unset;}");
				TorrServerCFG.open();
			});
			var get_kinozal_link = KinozalCFG.get('KinopoiskLinkSearch'),
				set_kinozal_link = "";
		}
	}
	else if (/rutor.(info|is)\//.test(get_url))
	{
		if (RUTOR_SwalDefaultStyle == 1)
		{
			GM_addStyle('@import "https://cdn.jsdelivr.net/npm/@sweetalert2/theme-bootstrap-4/bootstrap-4.min.css";');
		}
		else if (RUTOR_SwalDefaultStyle == 2)
		{
			GM_addStyle('@import "https://cdn.jsdelivr.net/npm/@sweetalert2/theme-borderless/borderless.min.css";.swal2-container.swal2-backdrop-show, .swal2-container.swal2-noanimation {background: rgb(255 255 255);}.swal2-title {color: #000;}');
		}
		else if (RUTOR_SwalDefaultStyle == 3)
		{
			GM_addStyle('@import "https://cdn.jsdelivr.net/npm/@sweetalert2/theme-bulma/bulma.min.css";');
		}
		else if (RUTOR_SwalDefaultStyle == 4)
		{
			GM_addStyle('@import "https://cdn.jsdelivr.net/npm/@sweetalert2/theme-default/default.min.css";');
		}
		else if (RUTOR_SwalDefaultStyle == 5)
		{
			GM_addStyle('@import "https://cdn.jsdelivr.net/npm/@sweetalert2/theme-material-ui/material-ui.min.css";');
		}
		else if (RUTOR_SwalDefaultStyle == 6)
		{
			GM_addStyle('@import "https://cdn.jsdelivr.net/npm/@sweetalert2/theme-minimal/minimal.min.css";');
		}
	}
	else if (/rutracker.org\//.test(get_url))
	{
		if (RT_SwalDefaultStyle == 1)
		{
			GM_addStyle('@import "https://cdn.jsdelivr.net/npm/@sweetalert2/theme-bootstrap-4/bootstrap-4.min.css";');
		}
		else if (RT_SwalDefaultStyle == 2)
		{
			GM_addStyle('@import "https://cdn.jsdelivr.net/npm/@sweetalert2/theme-borderless/borderless.min.css";.swal2-container.swal2-backdrop-show, .swal2-container.swal2-noanimation {background: rgb(255 255 255);}.swal2-title {color: #000;}');
		}
		else if (RT_SwalDefaultStyle == 3)
		{
			GM_addStyle('@import "https://cdn.jsdelivr.net/npm/@sweetalert2/theme-bulma/bulma.min.css";');
		}
		else if (RT_SwalDefaultStyle == 4)
		{
			GM_addStyle('@import "https://cdn.jsdelivr.net/npm/@sweetalert2/theme-default/default.min.css";');
		}
		else if (RT_SwalDefaultStyle == 5)
		{
			GM_addStyle('@import "https://cdn.jsdelivr.net/npm/@sweetalert2/theme-material-ui/material-ui.min.css";');
		}
		else if (RT_SwalDefaultStyle == 6)
		{
			GM_addStyle('@import "https://cdn.jsdelivr.net/npm/@sweetalert2/theme-minimal/minimal.min.css";');
		}
	}
	GM_addStyle(`@import url(https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css);@font-face{font-family:"Open Sans";font-style:normal;font-weight:400;src:local("Open Sans"),local(OpenSans),url(https://themes.googleusercontent.com/static/fonts/opensans/v6/K88pR3goAWT7BTt32Z01mz8E0i7KZn-EPnyo3HZu7kw.woff) format("woff")}.fa{font-family:FontAwesome}.checkboxToggle b{cursor:pointer;position:relative;display:inline-block;width:54px;height:29px;background:#f2f2f2;border:1px solid #d0d0d0;border-radius:23px;vertical-align:text-bottom;transition:all .2s linear}.checkboxToggle b::after{content:"";position:absolute;left:0;width:25px;height:25px;background-color:#fff;border-radius:30px;box-shadow:0 0 2px rgb(0 0 0 / 50%);transform:translate3d(2px,2px,0);transition:all .2s ease-in-out}.checkboxToggle:active b::after{width:35px;transform:translate3d(2px,2px,0)}.checkboxToggle:active input:checked+b::after{transform:translate3d(17px,2px,0)}.checkboxToggle input{display:none}.checkboxToggle input:checked+b{background-color:#4bd763;border-color:#3aa24c}.checkboxToggle input:checked+b::after{transform:translate3d(27px,2px,0)}.ScriptSettingsContainer tbody>tr:hover td:nth-child(1){background-color:#f5f5f58c;border-radius:10px 0 0 10px;border-top-color:#d0d0d0;border-top-style:solid;border-top-width:1px;border-right-color:#f5f5f58c;border-bottom-color:#d0d0d0;border-bottom-style:solid;border-bottom-width:1px;border-left-color:#d0d0d0;border-left-style:solid;border-left-width:1px}.ScriptSettingsContainer tbody>tr:hover td:nth-child(2){background-color:#f5f5f58c;border-radius:0 10px 10px 0;border-top-color:#d0d0d0;border-top-style:solid;border-top-width:1px;border-right-color:#d0d0d0;border-right-style:solid;border-right-width:1px;border-bottom-color:#d0d0d0;border-bottom-style:solid;border-bottom-width:1px;border-left-color:#f5f5f58c}.ScriptSettingsContainer tbody>tr td:nth-child(1){border:1px solid #fff}.ScriptSettingsContainer tbody>tr td:nth-child(2){border:1px solid #fff;padding:4px 0}.swal2-styled.swal2-cancel,.swal2-styled.swal2-confirm,.swal2-styled.swal2-deny{font-family:"Open Sans";text-transform:uppercase;cursor:pointer;outline:0;padding:0 10px;font-weight:700;text-align:center;vertical-align:middle;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;line-height:1.5;font-size:1.7rem;border-radius:.25rem;transition:all .1s;color:#fff;border:0;text-shadow:0 0 1px #000,1px 1px 1px #000}.swal2-content{font-style:normal;text-align:left;color:#000;padding:0}.fnm-title{margin:auto;font-weight:700;font-family:Open Sans;text-transform:uppercase;font-size:35px;margin:0 0 10px 0;color:rgb(221 60 60);text-shadow:1px 1px 1px rgb(92 0 0),2px 2px 1px rgb(92 0 0)}.fnm-ads-title{font-weight:700;font-family:Open Sans;text-transform:uppercase;font-size:28px;text-align:center;padding:0 0 4px 0}.fnm-no-ads{color:rgb(0 153 0);text-shadow:1px 1px 1px rgb(0 78 0)}.fnm-with-ads{color:rgb(255 0 0);text-shadow:1px 1px 1px rgb(78 0 0)}.btn_tiny{transition:border-color .3s,box-shadow .3s;font-family:"Open Sans";text-transform:uppercase;cursor:pointer;outline:0;font-weight:700;text-align:center;vertical-align:middle;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;line-height:1.5;font-size:14px;border-radius:.25rem;transition:all .1s;color:#fff;border:0;text-shadow:0 0 1px #000,1px 1px 1px #000;padding:revert}.btn_small{transition:border-color .3s,box-shadow .3s;font-family:"Open Sans";text-transform:uppercase;cursor:pointer;outline:0;font-weight:700;text-align:center;vertical-align:middle;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;line-height:1.5;font-size:18px;border-radius:.25rem;transition:all .1s;color:#fff;border:0;text-shadow:0 0 1px #000,1px 1px 1px #000;padding:revert}.btn_normal{transition:border-color .3s,box-shadow .3s;font-family:"Open Sans";text-transform:uppercase;cursor:pointer;outline:0;font-weight:700;text-align:center;vertical-align:middle;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;line-height:1.5;font-size:24px;border-radius:.25rem;transition:all .1s;color:#fff;border:0;text-shadow:0 0 1px #000,1px 1px 1px #000;padding:revert}.btn_big{transition:border-color .3s,box-shadow .3s;font-family:"Open Sans";text-transform:uppercase;cursor:pointer;outline:0;font-weight:700;text-align:center;vertical-align:middle;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;line-height:1.5;font-size:30px;border-radius:.25rem;transition:all .1s;color:#fff;border:0;text-shadow:0 0 1px #000,1px 1px 1px #000;padding:revert}.btn_cred{color:#fff;background-color:#d92638}.btn_cred:hover{color:#fff;background-color:#c32232;box-shadow:0 0 0 .1rem rgba(225,83,97,.5)}.btn_cred:active,.btn_cred:focus{color:#fff;background-color:#ad1f2d;box-shadow:0 0 0 .2rem rgba(225,83,97,.5)}.btn_cblue{color:#fff;background-color:#2778c4}.btn_cblue:hover{color:#fff;background-color:#236cb0;box-shadow:0 0 0 .1rem rgba(35,108,176,.5)}.btn_cblue:active,.btn_cblue:focus{color:#fff;background-color:#1f609d;box-shadow:0 0 0 .2rem rgba(35,108,176,.5)}.btn_cgreen{color:#fff;background-color:#4fc823}.btn_cgreen:hover{color:#fff;background-color:#47b41f;box-shadow:0 0 0 .1rem rgba(79,200,35,.5)}.btn_cgreen:active,.btn_cgreen:focus{color:#fff;background-color:#3fa01c;box-shadow:0 0 0 .2rem rgba(79,200,35,.5)}.btn_corange{color:#fff;background-color:#d99d26}.btn_corange:hover{color:#fff;background-color:#c38d22;box-shadow:0 0 0 .1rem rgba(199,144,35,.5)}.btn_corange:active,.btn_corange:focus{color:#fff;background-color:#a0741c;box-shadow:0 0 0 .2rem rgba(199,144,35,.5)}.MT2{margin:2px}.MT4{margin:4px}.MT6{margin:6px}.MT8{margin:8px}.MT10{margin:10px}`);
	async function ShowSweetAlertInfo(GetID, GetPage)
	{
		var GetCAT = "",
			get_name_first, GetFullName, get_maininfo, get_maininfo_full, maininfo, get_maininfo_name, get_maininfo_year, grelscr_id, grel_id, gscr_id, show_filelist = "",
			show_release = "",
			show_screenshoot = "",
			get_menu_info, set_menu_info, razdajut, skacivajut, skaciali, spisokfailov, komentarijev, get_kinopoisk, kinopoisk_link, get_main_img, get_main_img_url, show_aboutfile, get_aboutfile, similarfiles_link, get_aboutmovie, ads_result = "",
			matchaboutfile, replaceaboutfile, full_name_youtube, youtube_link;

		function DetailsInfo(GetID)
		{
			return fetch(get_full_url + '/details.php?id=' + GetID,
			{
				method: "GET",
			}).then(windows1251ResponseToUTF8Response).then(function (response)
			{
				return response.text();
			}).then(async function (data)
			{
				GM_addStyle(".menuinfo .floatright{float:right;color:#f00}.menuinfo{font-weight:bold}");
				const parser = new DOMParser();
				const doc = parser.parseFromString(data, "text/html");
				if (!doc.querySelector("#main > div").innerText.match(/Нет раздачи с таким ID/))
				{
					GetFullName = doc.querySelector(".mn_wrap h1 a").innerText.toUpperCase();
					get_name_first = GetFullName.split(" / ")[0];
					get_aboutfile = doc.querySelector("div.bx1.justify p").innerHTML;
					matchaboutfile = get_aboutfile.match(/<b>.*<\/b>/)[0].replace(/(<([^>]+)>)/ig, '').replace(':', '');
					replaceaboutfile = get_aboutfile.replace(/<([^>]+)>.*<([^>]+)> /, '');
					show_aboutfile = spoilerblock(matchaboutfile, replaceaboutfile);
					grelscr_id = doc.querySelector("ul.lis").innerHTML;
					maininfo = doc.querySelector('#tabs');
					get_maininfo_full = doc.querySelector("div.bx1.justify h2").innerHTML;
					GetCAT = doc.querySelector("img.cat_img_r").getAttribute('onclick').match(/[0-9]+/)[0];
					get_maininfo_name = doc.querySelector("div.bx1.justify h2").innerText.match(/(Исполнитель: |Оригинальное название: |Название: |Альбом: )(.*)/)[2];
					get_maininfo_year = doc.querySelector("div.bx1.justify h2").innerText.match(/Год выпуска: ([\d+]{4})/)[1];
					get_menu_info = doc.querySelector(".mn1_menu ul.men").innerText;
					razdajut = get_menu_info.match(/Раздают(\d+)/);
					skacivajut = get_menu_info.match(/Скачивают(\d+)/);
					skaciali = get_menu_info.match(/Скачали(\d+)/);
					spisokfailov = get_menu_info.match(/Список файлов(\d+)/);
					komentarijev = get_menu_info.match(/Комментариев(\d+)/);
					get_kinopoisk = doc.querySelector("a[href*='kinopoisk.ru']");
					get_aboutmovie = get_aboutfile.indexOf("О фильме:") !== -1;
					full_name_youtube = get_maininfo_name + " " + get_maininfo_year;
					grel_id = (grelscr_id.match(/<a onclick="showtab\(\d+,(\d+)\); return false;" href="#">Релиз<\/a>/) !== null ? grelscr_id.match(/<a onclick="showtab\(\d+,(\d+)\); return false;" href="#">Релиз<\/a>/)[1] : null);
					gscr_id = (grelscr_id.match(/<a onclick="showtab\(\d+,(\d+)\); return false;" href="#">Скриншоты<\/a>/) !== null ? grelscr_id.match(/<a onclick="showtab\(\d+,(\d+)\); return false;" href="#">Скриншоты<\/a>/)[1] : null);
					get_main_img = (doc.querySelector("ul.men.w200 li.img") !== null ? '<img src="' + doc.querySelector("ul.men.w200 li.img a img").src + '" style="display: block;margin-left: auto;margin-right: auto;padding:0px 0px 10px 0px;width: 250px;" alt="">' : '');
					get_main_img_url = (doc.querySelector("ul.men.w200 li.img") !== null ? doc.querySelector("ul.men.w200 li.img a img").src : "");
					get_maininfo = (KZ_ChangePersonLinks ? get_maininfo_full.replace(/persons.php\?s=/g, "browse.php?g=1&t=1&s=").replace(/ target="_blank"/g, "") : get_maininfo_full);
					set_menu_info = (razdajut !== null ? '<span class="menuinfo">Раздают<span class="floatright">' + razdajut[1] + '</span></span><br>' : '') + (skacivajut !== null ? '<span class="menuinfo">Скачивают<span class="floatright">' + skacivajut[1] + '</span></span><br>' : '') + (skaciali !== null ? '<span class="menuinfo">Скачали<span class="floatright">' + skaciali[1] + '</span></span><br>' : '') + (spisokfailov !== null ? '<span class="menuinfo">Список файлов<span class="floatright">' + spisokfailov[1] + '</span></span><br>' : '') + (komentarijev !== null ? '<span class="menuinfo">Комментариев<span class="floatright">' + komentarijev[1] + '</span></span><br>' : '');
					similarfiles_link = (doc.querySelector('#tabs2').innerText.match(/Подобные раздачи найдено (\d+) раздач/) !== null ? '<p style="font-size:12px;text-align:center;padding:0px 0px 10px 0px;font-weight:bold;"><a href="javascript:void(0);" onclick="window.open(\'browse.php?s=' + doc.querySelector('#tabs2 td.w90p').innerHTML.split('?s=')[1].split('&')[0] + '&d=' + (get_maininfo_year !== null ? get_maininfo_year : '0') + '&t=1\',\'_self\')" style="color:red;margin-left: auto;margin-right: auto;">НАЙДЕНО ' + declOfNum(doc.querySelector('#tabs2').innerText.match(/Подобные раздачи найдено (\d+) раздач/)[1], ['ПОДОБНАЯ РАЗДАЧА', 'ПОДОБНЫЕ РАЗДАЧИ', 'ПОДОБНЫХ РАЗДАЧ']) + ' </a></p>' : '');
					youtube_link = (get_aboutmovie ? '<button type="button" class="btn_small btn_cred MT4" onclick="window.open(\'https://www.youtube.com/results?search_query=' + fixedEncodeURIComponent(full_name_youtube + ' русский трейлер') + '\')" style="display: block;margin-left: auto;margin-right: auto;">YOUTUBE ТРЕЙЛЕР</button>' : '');
					kinopoisk_link = (get_kinopoisk !== null ? '<button type="button" class="btn_small btn_cblue MT4" onclick="window.open(\'' + get_kinopoisk.href + '\')" style="display: block;margin-left: auto;margin-right: auto;">КИНОПОИСК</button><button type="button" class="btn_small btn_cblue MT4" onclick="window.open(\'' + get_kinopoisk.href + '/like\')" style="display: block;margin-left: auto;margin-right: auto;">КИНОПОИСК ПОХОЖИЕ</button>' : '');
					if (grel_id !== null)
					{
						function release_fetch()
						{
							return fetch(get_full_url + '/get_srv_details.php?id=' + GetID + '&pagesd=' + grel_id,
							{
								method: "GET",
							}).then(function (response)
							{
								if (!response.ok)
								{
									throw Error(response.statusText)
								}
								return response.text();
							}).then(function (data)
							{
								const parser = new DOMParser();
								const doc = parser.parseFromString(data, "text/html").querySelector("body");
								const ads = doc.innerText.toLowerCase();
								if (ads.match(match_no_ads))
								{
									ads_result = '<p class="fnm-ads-title fnm-no-ads">РАЗДАЧА БЕЗ РЕКЛАМЫ</p>';
								}
								else if (ads.match(match_with_ads))
								{
									ads_result = '<p class="fnm-ads-title fnm-with-ads">ПРИСУТСТВУЕТ РЕКЛАМА</p>';
								}
								return spoilerblock("Релиз", data);
							})
						}
						show_release = await release_fetch();
					}
					if (gscr_id !== null)
					{
						function screen_fetch()
						{
							return fetch(get_full_url + '/get_srv_details.php?id=' + GetID + '&pagesd=' + gscr_id,
							{
								method: "GET",
							}).then(function (response)
							{
								if (!response.ok)
								{
									throw Error(response.statusText)
								}
								return response.text();
							}).then(function (data)
							{
								return spoilerblock("Скриншоты", data, "open", "red");
							})
						}
						show_screenshoot = await screen_fetch();
					}
					return get_maininfo_name;
				}
				else
				{
					return "Торрент файл не найден";
				}
			});
		}

		function SrvDetailsHash(GetID)
		{
			return fetch(get_full_url + '/get_srv_details.php?id=' + GetID + '&action=2',
			{
				method: "GET",
			}).then(function (response)
			{
				return response.text();
			}).then(async function (data)
			{
				if (!data.match(/Торрент файл не найден/))
				{
					GM_addStyle(".treeview li {background: url('data:image/gif;base64,R0lGODlhEADwBvcAAAAAAICAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAP8ALAAAAAAQAPAGAAj/AP8JHEiwoMAABhMqXPgPIcOHCx1CnEhQIkWKCDM23Kjx4kCLHh+CDBmR5MSRJg2iTFmRJcOVLjfGTAjTZU2WN1PmNLmTZM+QPz0GvTgU40yaR1UmLVj05NKWTw9GlTq1KUSrIqfKjIr1pdauJat+HSu2LFeyZ80+BauQLVK1S90qhZtULlO0a/HG1VuX71G7UNMKzkv3r9+ZgD8ejpmY6uC9hREvtjkZZ2Wdl3lm9rkZaGehn4mGNhqZ8WinpSmntrwac2vNrznH9jwbdG3Rt0k/7psb9W7Dva+eFh48a3Gvx8P+lpy87XDjy003fxtddXXW111nh71ddnfa322H/8c9Xjfh8r7Pq4eMnnh76Ot5v0c+X3l84PWdT5+bn/p95v3x9590Ad61n4EFBjagdQti16B2D3IXoXcTgleheBeSl6F57G2YXocgyueheyPCFyJ+JdKXon0nAriifgkqdqCCLRL4on81MpijgztC2KOEP1IYpIVDYlikhkdyKGKSHy7pJIpMkhiliU+6OKWKV7JYpY1ZwnijgF3iuKWOY/JYpo9nApmmkGsS2aaRbyIZp5JQztlknXhaaaeUe1KZJ5d9Yhmoln+SWaiZh6KZqJqLstmom4/CGamck9KpZ6V3XqopoJjy2amfmxoaKqKjKloqo6c6miqkq0raKqWvWv/KaayZzmqrqLeSmqupu6Laq6q/shqsq8PCWqysuCarq7K8Muurs8BCK6y0xFJrrLXILqtts9s+2220304bbrXjXltuttym66264LIrrrvkwmuuvOiua2+7976bb7z7zttvvfgGrK/A/BLsr8EAD6xwwQsf3HDCDEfssMQQT2xxxRjXiq3G53JMr8f/goywyA+TTLHJF6Ocsae0snysyjC7vLHMHdP8sc0h4zyyziXzfLLPKQO9MqgvCx0z0TMjXbPSNzOds9M7Q92z1D9THbTVQwv6qdYtY30010V7bfTYYpcNdtJnL51202s/3XbUb08dd9VzX1131oR2fffXeYf/vTfZf5vdN9qDq10424e7nTjci8vdON2P2x053l6GCeaglWMu5taT850555/r3Tngowseut+lB6566qyfTrjrhsOOuOyK08647Y7jDrnukvNO+eai++458KgLT7rxphP/uvKxMz+787VDf7v0uVO/u/W9Y//75aBrPzz3wXt/vPjJg188+asjnz76rbOvfvvmLx9/8/M/X3/090+ff/X7X99/9v/bHoK+NEDLFVBzAfzeAbuXwPE1sHwLDN8D1zdB+EXwfBV8nwbdx8EMdvCC8gMh/URoPxLiz4T6QyH/VOg/FgLQhQKkEQJhqEAZMpCGDsQhBG0oQR1S0IcW5CEGqoG4QQ8akYgfFGIIlThCJpbQiSeEYgqluEIqttCKL8RiDGUUI8cQUIs15OIXxWhAMObQjDsk4wzR+EM2BlGNN3RjEZF4RDkmEY49tGMd8ThEPdLxj34MJB+XOMgmFvKJh4xiIqe4yCo28oqPzGIkt+jFMk4yjJVc4yXPuMk0ZjKOnWxjKN/4yTyOco6CLGUfT3lHVRLSlYaEJSJlqUhaMtKWjpSKRnYpk4AAADs=') 0 0 no-repeat;padding: 1px 0px 0px 16px;}.treeview li i, .ing i { color: green; font-style:normal;}");
					show_filelist = ($(data)[0].querySelector(".treeview") !== null ? spoilerblock("Список файлов", "<div class=\"treeview\">" + $(data)[0].querySelector(".treeview").innerHTML + "</div>") : "");
					return $(data)[0].innerText.match(/[a-zA-Z0-9]{40}/)[0];
				}
				else
				{
					return "Торрент файл не найден";
				}
			}).catch(function (e)
			{
				console.log("error #0\n" + e);
				SwallAutoCloseMsg("get_srv_details.php отклонил запрос<br>Ошибка:<br><i style=\"color:red\">" + e + "</i>", "5");
			});
		}
		let GetDetailsInfo = await DetailsInfo(GetID);
		let GetSrvDetailsHash = await SrvDetailsHash(GetID);
		if ((GetDetailsInfo || GetSrvDetailsHash) == "Торрент файл не найден")
		{
			console.log("ShowSweetAlertInfo\nТоррент файл не найден");
			SwallAutoCloseMsg("ShowSweetAlertInfo отклонил запрос<br>Ошибка:<br><i style=\"color:red\">Торрент файл не найден</i>", "5");
		}
		else
		{
			var Gethash = await GetSrvDetailsHash,
				cat_name = "",
				KZ_ShowDLButtons = "",
				KZ_TorrentButton = "",
				KZ_MagnetButton = "",
				KZ_CopyMagnetButton = "",
				KZ_TorrServerButton = "";
			if (KZ_ShowTorrentButton)
			{
				KZ_TorrentButton = '<button id="download_torrent_file" type="button" class="btn_tiny btn_cgreen MT4" style="padding: 0px 7px;font-size:22px;" title="СКАЧАТЬ ТОРРЕНТ ФАЙЛ"><i class="fa fa-download"></i> ТОРРЕНТ ФАЙЛ</button>';
			}
			if (KZ_ShowMagnetButton)
			{
				KZ_MagnetButton = '<button id="download_with_magnet" type="button" class="btn_tiny btn_cblue MT4" style="padding: 0px 7px;font-size:22px;" title="СКАЧАТЬ ЧЕРЕЗ MAGNET"><i class="fa fa-download"></i> ЧЕРЕЗ MAGNET</button>';
			}
			if (KZ_ShowCopyMagnetButton)
			{
				KZ_CopyMagnetButton = '<button id="copy_with_magnet" type="button" class="btn_tiny btn_cblue MT4" style="padding: 0px 7px;font-size:22px;" title="СКОПИРОВАТЬ MAGNET ССЫЛКУ"><i class="fa fa-copy"></i> MAGNET</button>';
			}
			if (KZ_ShowTorrServerButton)
			{
				KZ_TorrServerButton = '<button id="add_to_torrserver" type="button" class="btn_tiny btn_cred MT4" style="padding: 0px 7px;font-size:22px;" title="ДОБАВИТЬ В TORRSERVER"><i class="fa fa-plus-square"></i> TORRSERVER</button>';
			}
			KZ_ShowDLButtons = (KZ_ChangeButtonToLink && GetPage == "search" || GetPage == "top" ? KZ_TorrentButton + KZ_MagnetButton + KZ_CopyMagnetButton + KZ_TorrServerButton : "");
			Swal.fire(
			{
				width: KZ_SwalDetailedInfoWidth,
				html: `
<h2 class="swal2-title fnm-title">${get_name_first} / ${get_maininfo_year}</h2>
${ads_result}
<table>
<tr>
<td style="vertical-align:top;padding: 0px 10px 0px 0px;font-size: 12px;">
<div style="width: 250px;">
${get_main_img}
${similarfiles_link}
${set_menu_info}
<br>
${maininfo.innerHTML}
${youtube_link}
${kinopoisk_link}
</div></td>
<td style="vertical-align:top;padding:0px;font-size: 12px;width:100%;">
${get_maininfo}
${show_aboutfile}
${show_release}
${show_screenshoot}
${show_filelist}
</td>
</tr>
</table>
<center>
${KZ_ShowDLButtons}</center>`,
				showCancelButton: false,
				showConfirmButton: false,
				footer: "<center>" + (KZ_ChangeButtonToLink && GetPage == "search" || GetPage == "top" ? '<button type="button" onclick="window.open(\'details.php?id=' + GetID + '\',\'_self\')" class="btn_small btn_cblue MT4">ОТКРЫТЬ РАЗДАЧУ</button> <button type="button" id="cancel" class="btn_small btn_cred MT4">ЗАКРЫТЬ</button>' : '<button type="button" id="cancel" class="btn_small btn_cred MT4">ЗАКРЫТЬ</button>') + "</center>",
				didOpen: () =>
				{
					Swal.getFooter().querySelector('button#cancel').focus();
				}
			});
			$("#download_torrent_file").click(function ()
			{
				window.location.href = get_full_url + "/download.php?id=" + GetID;
				SwallAutoCloseMsg("Скачивается торрент файл!", "2");
			});
			$("#download_with_magnet").click(function ()
			{
				window.location.href = "magnet:?xt=urn:btih:" + Gethash;
				SwallAutoCloseMsg("Скачивается через Magnet!", "2");
			});
			$("#copy_with_magnet").click(function ()
			{
				copy(Gethash);
				SwallAutoCloseMsg("Magnet ссылка скопирована!", "2");
			});
			$("#add_to_torrserver").click(function ()
			{
				if (GetCAT.match(/45|46|8|6|15|17|35|39|13|14|24|11|10|9|47|18|37|12|7|48|49|50|38|16|21|22|20/) !== null)
				{
					if (TSVersion === "old")
					{
						let Data = {
							'Link': Gethash,
							'DontSave': !true,
							'Info': JSON.stringify(
							{
								'poster_path': get_main_img_url
							})
						};
						TS_POST("torrent/add", JSON.stringify(Data), (response) =>
						{
							if (/^[0-9a-f]{40}$/i.test(response))
							{
								SwallAutoCloseMsg("Раздача добавлена в TorrServer!", "2");
							}
							else SwallAutoCloseMsg("TorrServer отклонил запрос", "2");
						});
					}
					else
					{
						let Data = {
							'action': 'add',
							'link': Gethash,
							'title': GetFullName,
							'poster': get_main_img_url,
							'save_to_db': true
						};
						TS_POST("torrents", JSON.stringify(Data), (response) =>
						{
							try
							{
								SwallAutoCloseMsg("Раздача добавлена в TorrServer!", "2");
							}
							catch (e)
							{
								console.log("error #2\n" + e);
								SwallAutoCloseMsg("TorrServer отклонил запрос<br>Ошибка:<br><i style=\"color:red\">" + e + "</i>", "5");
							}
						});
					}
				}
				else
				{
					SwallAutoCloseMsg("Данная раздача не является фильмом или сериалом, поэтому не может быть добавлена в TorrServer!", "3");
				}
			});
			$("#cancel").click(function ()
			{
				Swal.close();
			});
		}
	}
	if (reg_kinopoisk_like.test(get_url))
	{
		GM_addStyle(`.search_like_kinozal_button{font-family: arial,sans-serif;text-transform: uppercase;display: block;color: #666;font-size: 14px;font-weight: bold;text-align: center;border: 1px solid #bbb;border-radius: 4px;box-shadow: 0 1px 2px rgb(0 0 0 / 20%);background: -webkit-linear-gradient(top, #fff 0%, #efefef 100%);width: fit-content;padding: 10px;user-select: none;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;cursor: pointer;}.search_like_kinozal_button:hover{text-decoration: none;background: -webkit-linear-gradient(top, #efefef 0%, #fff 100%);}`);
		if (get_kinozal_link == "kinozal1")
		{
			set_kinozal_link = "kinozal.tv";
		}
		else if (get_kinozal_link == "kinozal2")
		{
			set_kinozal_link = "kinozal.me";
		}
		else if (get_kinozal_link == "kinozal3")
		{
			set_kinozal_link = "kinozal.guru";
		}
		else if (get_kinozal_link == "kinozal4")
		{
			set_kinozal_link = "kinozaltv.life";
		}
		$('#block_left_pad > ul > li:nth-child(3)').each(function (i, e)
		{
			var get_name_first = $(e).find("h1 > a").text();
			var get_years = $(e).find("div").text().match(/([\d+]{4})/);
			$(e).append('<div class="search_like_kinozal_button" onclick="window.open(\'//' + set_kinozal_link + '/browse.php?s=' + fixedEncodeURIComponent(get_name_first) + '&d=' + (get_years !== null ? get_years[1] : '0') + '&t=1\')">Искать в Кинозале</div>');
		});
		$('table.ten_items tbody').find("tr").each(function (i, e)
		{
			var get_name_first = $(e).find("td.news > div > div:nth-child(1) > a").text().replace(/ \(сериал\)/, "");
			var get_years = $(e).find("td.news > div > div:nth-child(1) > span").text().match(/([\d+]{4})/);
			$(e).find("td.news > div").append('<div class="search_like_kinozal_button" onclick="window.open(\'//' + set_kinozal_link + '/browse.php?s=' + fixedEncodeURIComponent(get_name_first) + '&d=' + (get_years !== null ? get_years[1] : '0') + '&t=1\')">Искать в Кинозале</div>');
		});
	}
	if (reg_kinopoisk_main.test(get_url))
	{
		const QUERY_DATA = {};
		const querystring = (str) => (str.replace(/(?:%(\w+)?)/g, (str, word) =>
		{
			if (word === undefined) return '';
			word = word.toLowerCase();
			return word in QUERY_DATA ? encodeURIComponent(QUERY_DATA[word]) : str;
		}));
		const extractQueryData = () =>
		{
			try
			{
				const script = document.querySelector('#__NEXT_DATA__');
				const
				{
					props,
					query
				} = JSON.parse(script.textContent);
				const
				{
					apolloState:
					{
						data
					}
				} = props;
				const
				{
					id
				} = query;
				const
				{
					releaseYears,
					productionYear,
					title
				} = (data[`TvSeries:${id}`] || data[`Film:${id}`]);
				const [year] = Array.isArray(releaseYears) ? releaseYears : [productionYear];
				const
				{
					start,
					end
				} = typeof year === 'object' ? year :
				{
					start: year,
					end: year
				};
				Object.assign(QUERY_DATA,
				{
					year: start,
					endyear: end,
					engtext: title.original || title.russian,
					text: title.russian
				});
			}
			catch
			{}
		};
		extractQueryData();
		if (get_kinozal_link == "kinozal1")
		{
			set_kinozal_link = "kinozal.tv";
		}
		else if (get_kinozal_link == "kinozal2")
		{
			set_kinozal_link = "kinozal.me";
		}
		else if (get_kinozal_link == "kinozal3")
		{
			set_kinozal_link = "kinozal.guru";
		}
		else if (get_kinozal_link == "kinozal4")
		{
			set_kinozal_link = "kinozaltv.life";
		}
		GM_addStyle(".resources{padding: 10px 0px;}.search_main_kinozal_button{font-family: arial,sans-serif;text-transform: uppercase;display: block;color: #666;font-size: 24px;font-weight: bold;text-align: center;border: 1px solid #bbb;border-radius: 4px;box-shadow: 0 1px 2px rgb(0 0 0 / 20%);background: -webkit-linear-gradient(top, #fff 0%, #efefef 100%);padding: 10px;user-select: none;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;cursor: pointer;}.search_main_kinozal_button:hover{text-decoration: none;background: -webkit-linear-gradient(top, #efefef 0%, #fff 100%);}");
		$('.styles_posterContainer__1w5Ik').append("<div class=\"resources\"><div class=\"search_main_kinozal_button\" onclick=\"window.open(\'" + querystring('//' + set_kinozal_link + '/browse.php?s=%text&d=%year&t=1') + "\')\">Искать в Кинозале</div></div>");
	}
	if (reg_kinozal_top.test(get_url))
	{
		GM_addStyle(`div.spoilerButton {display: block;max-width: 100%;border: 1px solid #8394b2ad;border-left: 4px solid #8394b2ad;margin: 8px 0 0;font-family: Verdana, Tahoma, Arial, 'Trebuchet MS', sans-serif, Georgia, Courier, 'Times New Roman', serif;box-sizing: border-box;-moz-box-sizing: border-box;-webkit-box-sizing: border-box;}div.spoilerButton>.block-title{display: block;cursor: pointer;color: #000;max-width: 100%;margin: 0px;padding: 7px 7px;background: #E4EAF2;font-weight: bold;font-size: 11px;user-select: none;}div.spoilerButton.open>.block-title:before{content: url(data:image/gif;base64,R0lGODlhCQAJAMQeAOLt+ff8//z+/4CRxo2by7vF6a254X6PxICQw87a74CQxuXo84CQxM/b7/H6/v7+/oGRxouayoGSxv7+/8LN7IqZyv7//4KSxur0/MrV74OTx9Ld8trl9gwMDP///wAAACH5BAEAAB4ALAAAAAAJAAkAAAU4oFcpwzFAkWgUVLZxCQGxLgdgGtS+t6NJmY5QOEFcNo/kZGLRXGwYR0DQjDSiU8uCIJJIGJdLKgQAOw==) " (";}div.spoilerButton.close>.block-title:before{content: url(data:image/gif;base64,R0lGODlhCQAJAMQfAIqZyoGSxv3+/trl84CQxYCRxn6PxMXQ7efq9H+Pwtnk8oKTxoCQxKy44QAAANvl9rvG6fD5/o2by4GRxvb8//v9//7+/ubw+v39/ouayoKSxoOTx/7+/wwMDP///////yH5BAEAAB8ALAAAAAAJAAkAAAU84AdoGkNmX4Z4HldRirSxXMdF1zK7nXU9mk2t4+h0BIlNhWPpYTCBDQXXwRwggczgJ8BAGhLRZGIoEFAhADs=) " (";}div.spoilerButton>.block-title:after{content: ")";}div.spoiler-body {border: 1px solid #8394b2ad;border-left-width: 4px;clear: both;display: block;margin: -1px 0px;background: #F5F5F5;padding: 6px;font-family: Verdana, Tahoma, Arial, 'Trebuchet MS', sans-serif, Georgia, Courier, 'Times New Roman', serif;}`);
		$(document).on('click', ".spoilerButton", function ()
		{
			var $this = $(this);
			var $isExpanded = $this.hasClass("open");
			$this.toggleClass("open").toggleClass("close");
			$this.prop('title', $isExpanded ? "Открыть" : "Закрыть");
			if ($isExpanded)
			{
				$this.next().slideUp(200);
			}
			else
			{
				$this.next().slideDown(200);
			}
		});
		if (get_acc_login_check.match(/\( Выход \)/) !== null)
		{
			$('div.bx1.stable').find("a").each(function (i, e)
			{
				var url = $(e).attr('href');
				var uArgs = url.split('?')[1].split('&');
				var GetID = null;
				uArgs.forEach(function (el)
				{
					if (el.startsWith('id='))
					{
						GetID = el.split('=')[1];
					}
				});
				if (GetID !== null)
				{
					$(e).replaceWith("<img src=\"" + $(e).find("img").prop('src') + "\" id=\"get_info_" + GetID + "\" style=\"cursor: pointer;\" title=\"" + $(e).attr("title") + "\">");
					$("#get_info_" + GetID).click(async function ()
					{
						await ShowSweetAlertInfo(GetID, "top");
					});
				}
			});
		}
	}
	if (reg_kinozal_search.test(get_url))
	{
		GM_addStyle(`div.spoilerButton {display: block;max-width: 100%;border: 1px solid #8394b2ad;border-left: 4px solid #8394b2ad;margin: 8px 0 0;font-family: Verdana, Tahoma, Arial, 'Trebuchet MS', sans-serif, Georgia, Courier, 'Times New Roman', serif;box-sizing: border-box;-moz-box-sizing: border-box;-webkit-box-sizing: border-box;}div.spoilerButton>.block-title{display: block;cursor: pointer;color: #000;max-width: 100%;margin: 0px;padding: 7px 7px;background: #E4EAF2;font-weight: bold;font-size: 11px;user-select: none;}div.spoilerButton.open>.block-title:before{content: url(data:image/gif;base64,R0lGODlhCQAJAMQeAOLt+ff8//z+/4CRxo2by7vF6a254X6PxICQw87a74CQxuXo84CQxM/b7/H6/v7+/oGRxouayoGSxv7+/8LN7IqZyv7//4KSxur0/MrV74OTx9Ld8trl9gwMDP///wAAACH5BAEAAB4ALAAAAAAJAAkAAAU4oFcpwzFAkWgUVLZxCQGxLgdgGtS+t6NJmY5QOEFcNo/kZGLRXGwYR0DQjDSiU8uCIJJIGJdLKgQAOw==) " (";}div.spoilerButton.close>.block-title:before{content: url(data:image/gif;base64,R0lGODlhCQAJAMQfAIqZyoGSxv3+/trl84CQxYCRxn6PxMXQ7efq9H+Pwtnk8oKTxoCQxKy44QAAANvl9rvG6fD5/o2by4GRxvb8//v9//7+/ubw+v39/ouayoKSxoOTx/7+/wwMDP///////yH5BAEAAB8ALAAAAAAJAAkAAAU84AdoGkNmX4Z4HldRirSxXMdF1zK7nXU9mk2t4+h0BIlNhWPpYTCBDQXXwRwggczgJ8BAGhLRZGIoEFAhADs=) " (";}div.spoilerButton>.block-title:after{content: ")";}div.spoiler-body {border: 1px solid #8394b2ad;border-left-width: 4px;clear: both;display: block;margin: -1px 0px;background: #F5F5F5;padding: 6px;font-family: Verdana, Tahoma, Arial, 'Trebuchet MS', sans-serif, Georgia, Courier, 'Times New Roman', serif;}`);
		$(document).on('click', ".spoilerButton", function ()
		{
			var $this = $(this);
			var $isExpanded = $this.hasClass("open");
			$this.toggleClass("open").toggleClass("close");
			$this.prop('title', $isExpanded ? "Открыть" : "Закрыть");
			if ($isExpanded)
			{
				$this.next().slideUp(200);
			}
			else
			{
				$this.next().slideDown(200);
			}
		});
		if (get_acc_login_check.match(/\( Выход \)/) !== null)
		{
			GM_addStyle(".t_peer td.swalbtn{width:45px;text-align:center}");
			if (KZ_ShowMarkTorrents)
			{
				if (!/(persons.php.*torr$|groupexreleaselist.php|groupex.php|groupextorrentlist.php)/i.test(get_url))
				{
					GM_addStyle("mark{" + (KZ_MarkBolder ? "text-shadow: -1px -1px 0px " + KZ_MarkBoldColorValue + ",0px -1px 0px " + KZ_MarkBoldColorValue + ",1px -1px 0px " + KZ_MarkBoldColorValue + ",1px 0px 0px " + KZ_MarkBoldColorValue + ",1px 1px 0px " + KZ_MarkBoldColorValue + ",0px 1px 0px " + KZ_MarkBoldColorValue + ",-1px 1px 0px " + KZ_MarkBoldColorValue + ",-1px 0px 0px " + KZ_MarkBoldColorValue + ";" : "") + "background: none;color: " + KZ_MarkColorValue + ";}");
				}
				var mark_instance = new Mark(document.querySelectorAll("a.r0,a.r1,a.r2,a.r3,a.r4,a.r5,a.r6"));
				mark_instance.mark(KZ_MarkTextValue);
			}
			var table = $('.t_peer');
			var h = table.find('.mn');
			if (KZ_ChangeButtonToLink)
			{
				if (!/(persons.php.*torr$|groupexreleaselist.php|groupex.php|groupextorrentlist.php)/i.test(get_url))
				{
					GM_addStyle("#main > div.content > div.bx2_0 > table > tbody > tr >td:nth-child(8) {display: none;}");
				}
			}
			else
			{
				GM_addStyle("div.kz_buttons{width: max-content;}.main_button_search {font-family: FontAwesome;margin: 0px 4px 0px 4px;cursor: pointer;outline: 0;padding: 6px;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;line-height: 0;font-size: 30px;border-radius: .25rem;color: #fff;background-color: #2778c4;border: 0;width: 44px;}.main_button_search:hover{color:#fff;background-color:#236cb0}.main_button_search:focus,.main_button_search:active{color:#fff;background-color:#1f609d}#main > div.content > div.bx2_0 > table > tbody > tr >td:nth-child(9) {display: none;}");
				h.prepend('<td class="z" style="width: 1px;"></td>');
			}
			table.find("tr").not(h).each(function (i, e)
			{
				var GetURL = $(e).find('.nam a').attr('href');
				var GetCAT = $(e).find('td.bt > img')[0].src.match(/cat\/([0-9]+)\.gif/)[1];
				var GetFullName = $(e).find('.nam a').text();
				var GetID = GetURL.match('id=([0-9]+)')[1];
				if (KZ_ChangeButtonToLink)
				{
					$(e).find('.nam a').prop('id', 'get_info_' + GetID).prop('href', 'javascript:void(0);');
				}
				else
				{
					var KZ_ShowButtons = "",
						KZ_TorrentButton = "",
						KZ_MagnetButton = "",
						KZ_CopyMagnetButton = "",
						KZ_TorrServerButton = "";
					if (KZ_ShowTorrentButton)
					{
						KZ_TorrentButton = '<button id="download_torrent_file_' + GetID + '" type="button" class="btn_tiny btn_cgreen MT2" style="padding: 0px 7px;font-size:22px;" title="СКАЧАТЬ ТОРРЕНТ ФАЙЛ"><i class="fa fa-download"></i></button>';
					}
					if (KZ_ShowMagnetButton)
					{
						KZ_MagnetButton = '<button id="download_magnet_' + GetID + '" type="button" class="btn_tiny btn_cblue MT2" style="padding: 0px 7px;font-size:22px;" title="СКАЧАТЬ ЧЕРЕЗ MAGNET"><i class="fa fa-magnet"></i></button>';
					}
					if (KZ_ShowCopyMagnetButton)
					{
						KZ_CopyMagnetButton = '<button id="copy_magnet_' + GetID + '" type="button" class="btn_tiny btn_cblue MT2" style="padding: 0px 7px;font-size:22px;" title="СКОПИРОВАТЬ MAGNET ССЫЛКУ"><i class="fa fa-copy"></i></button>';
					}
					if (KZ_ShowTorrServerButton)
					{
						KZ_TorrServerButton = '<button id="add_torrserver_' + GetID + '" type="button" class="btn_tiny btn_cred MT2" style="padding: 0px 7px;font-size:22px;" title="ДОБАВИТЬ В TORRSERVER"><i class="fa fa-plus-square"></i></button>';
					}
					KZ_ShowButtons = KZ_TorrentButton + KZ_MagnetButton + KZ_CopyMagnetButton + KZ_TorrServerButton;
					$(e).prepend(document.createElement('td'));
					$(e).children('td').eq(0).prepend(`<div class="kz_buttons"><button id="get_info_${GetID}" type="button" class="btn_tiny btn_corange MT2" style="padding: 0px 13px;font-size:22px;" title="ИНФОРМАЦИЯ О РАЗДАЧЕ"><i class="fa fa-info"></i></button>${KZ_ShowButtons}</div>`);
				}
				$("#get_info_" + GetID).click(async function ()
				{
					await ShowSweetAlertInfo(GetID, "search");
				});
				$("#download_torrent_file_" + GetID).click(function ()
				{
					if (KZ_ShowConfirmDownload)
					{
						Swal.fire(
						{
							title: "СКАЧАТЬ ТОРРЕНТ ФАЙЛ?",
							html: "<b style='color:#FF0000;'>Ваш рейтинг упадёт, а так же количество скачивании торрентов уменьшится в день!</b>",
							icon: 'question',
							showCancelButton: false,
							showDenyButton: true,
							confirmButtonColor: '#4fc823',
							cancelButtonColor: '#d33',
							denyButtonText: "НЕТ",
							confirmButtonText: "ДА",
						}).then(function (result)
						{
							if (result.value)
							{
								window.location.href = get_full_url + "/download.php?id=" + GetID;
								SwallAutoCloseMsg("Скачивается торрент файл!", "2");
							}
						});
					}
					else
					{
						window.location.href = get_full_url + "/download.php?id=" + GetID;
						SwallAutoCloseMsg("Скачивается торрент файл!", "2");
					}
				});
				$("#download_magnet_" + GetID).click(function ()
				{
					fetch(get_full_url + '/get_srv_details.php?id=' + GetID + '&action=2',
					{
						method: "GET",
					}).then(function (response)
					{
						return response.text();
					}).then(function (data)
					{
						if (KZ_ShowConfirmDownload)
						{
							Swal.fire(
							{
								title: "СКАЧАТЬ ЧЕРЕЗ MAGNET?",
								html: "<b style='color:#009900;'>Ваш рейтинг не упадёт, можете скачивать бесконечно!</b>",
								icon: 'question',
								showCancelButton: false,
								showDenyButton: true,
								confirmButtonColor: '#4fc823',
								cancelButtonColor: '#d33',
								denyButtonText: "НЕТ",
								confirmButtonText: "ДА",
							}).then(function (result)
							{
								if (result.isConfirmed)
								{
									window.location.href = hash;
									SwallAutoCloseMsg("Скачивается через Magnet!", "2");
								}
							});
						}
						else
						{
							window.location.href = "magnet:?xt=urn:btih:" + $(data)[0].innerText.match(/[a-zA-Z0-9]{40}/)[0];
							SwallAutoCloseMsg("Скачивается через Magnet!", "2");
						}
					}).catch(function (e)
					{
						console.log("error #3\n" + e);
						SwallAutoCloseMsg("get_srv_details.php отклонил запрос<br>Ошибка:<br><i style=\"color:red\">" + e + "</i>", "5");
					});
				});
				$("#copy_magnet_" + GetID).click(function ()
				{
					fetch(get_full_url + '/get_srv_details.php?id=' + GetID + '&action=2',
					{
						method: "GET",
					}).then(function (response)
					{
						return response.text();
					}).then(function (data)
					{
						copy("magnet:?xt=urn:btih:" + $(data)[0].innerText.match(/[a-zA-Z0-9]{40}/)[0]);
						SwallAutoCloseMsg("Magnet ссылка скопирована!", "2");
					});
				});
				$("#add_torrserver_" + GetID).click(function ()
				{
					if (GetCAT.match(/45|46|8|6|15|17|35|39|13|14|24|11|10|9|47|18|37|12|7|48|49|50|38|16|21|22|20/) !== null)
					{
						var GetHash = "",
							GetImageSrc = "",
							GetFullName = "";
						fetch(get_full_url + '/get_srv_details.php?id=' + GetID + '&action=2',
						{
							method: "GET",
						}).then(function (response)
						{
							return response.text();
						}).then(function (data)
						{
							return GetHash = "magnet:?xt=urn:btih:" + $(data)[0].innerText.match(/[a-zA-Z0-9]{40}/)[0];
						}).catch(function (e)
						{
							console.log("error #4\n" + e);
							SwallAutoCloseMsg("get_srv_details.php отклонил запрос<br>Ошибка:<br><i style=\"color:red\">" + e + "</i>", "5");
						});
						fetch(get_full_url + '/details.php?id=' + GetID,
						{
							method: "GET",
						}).then(windows1251ResponseToUTF8Response).then(function (response)
						{
							return response.text();
						}).then(function (data)
						{
							const parser = new DOMParser();
							const doc = parser.parseFromString(data, "text/html");
							GetImageSrc = doc.querySelector('.p200').src;
							GetFullName = doc.querySelector(".mn_wrap h1 a").innerText.toUpperCase();
							if (TSVersion === "old")
							{
								let Data = {
									'Link': GetHash,
									'DontSave': !true,
									'Info': JSON.stringify(
									{
										'poster_path': GetImageSrc
									})
								};
								TS_POST("torrent/add", JSON.stringify(Data), (response) =>
								{
									if (/^[0-9a-f]{40}$/i.test(response))
									{
										SwallAutoCloseMsg("Раздача добавлена в TorrServer!", "2");
									}
									else SwallAutoCloseMsg("TorrServer отклонил запрос", "2");
								});
							}
							else
							{
								let Data = {
									'action': 'add',
									'link': GetHash,
									'title': GetFullName,
									'poster': GetImageSrc,
									'save_to_db': true
								};
								TS_POST("torrents", JSON.stringify(Data), (response) =>
								{
									try
									{
										SwallAutoCloseMsg("Раздача добавлена в TorrServer!", "2");
									}
									catch (e)
									{
										console.log("error #5\n" + e);
										SwallAutoCloseMsg("TorrServer отклонил запрос<br>Ошибка:<br><i style=\"color:red\">" + e + "</i>", "5");
									}
								});
							}
						}).catch(function (e)
						{
							console.log("error #6\n" + e);
							SwallAutoCloseMsg("details.php отклонил запрос<br>Ошибка:<br><i style=\"color:red\">" + e + "</i>", "5");
						});
					}
					else
					{
						SwallAutoCloseMsg("Данная раздача не является фильмом, сериалом, поэтому не может быть добавлена в TorrServer!", "3");
					}
				});
			});
		}
	}
	if (reg_kinozal_detailed.test(get_url))
	{
		$(document).on('click', ".spoilerButton", function ()
		{
			var $this = $(this);
			var $isExpanded = $this.hasClass("open");
			$this.toggleClass("open").toggleClass("close");
			$this.prop('title', $isExpanded ? "Открыть" : "Закрыть");
			if ($isExpanded)
			{
				$this.next().slideUp(200);
			}
			else
			{
				$this.next().slideDown(200);
			}
		});
		if (get_acc_login_check.match(/\( Выход \)/) !== null)
		{
			if (KZ_ShowTorrentButton || KZ_ShowMagnetButton || KZ_ShowTorrServerButton)
			{
				var GetID = get_url.match('id=([0-9]+)')[1];
				var GetCAT = document.querySelector("img.cat_img_r").getAttribute('onclick').match(/[0-9]+/)[0];
				var GetFullName = $('.mn_wrap h1 a').text();
				var gfname = $('.mn_wrap h1 a').text().split(" / ");
				var getfname = gfname[0].toUpperCase();
				var GetImageSrc = document.querySelector('.p200').src;
				var set_buttons = document.querySelector("table.w100p");
				set_buttons.classList.add('bx1');
				var KZ_ShowButtons = "",
					KZ_TorrentButton = "",
					KZ_MagnetButton = "",
					KZ_CopyMagnetButton = "",
					KZ_TorrServerButton = "";
				if (KZ_DetailedInfoButtons)
				{
					if (KZ_ShowTorrentButton)
					{
						KZ_TorrentButton = '<button id="DownloadTorrentFile" type="button" class="btn_normal btn_cgreen MT4" title="СКАЧАТЬ ТОРРЕНТ ФАЙЛ"><i class="fa fa-download"></i> TORRENT</button>';
					}
					if (KZ_ShowMagnetButton)
					{
						KZ_MagnetButton = '<button id="DownloadMagnet" type="button" class="btn_normal btn_cblue MT4" title="СКАЧАТЬ ЧЕРЕЗ MAGNET"><i class="fa fa-download"></i> MAGNET</button>';
					}
					if (KZ_ShowCopyMagnetButton)
					{
						KZ_CopyMagnetButton = '<button id="CopyMagnet" type="button" class="btn_normal btn_cblue MT4" title="СКОПИРОВАТЬ MAGNET ССЫЛКУ"><i class="fa fa-copy"></i> MAGNET</button>';
					}
					if (KZ_ShowTorrServerButton)
					{
						KZ_TorrServerButton = '<button id="AddTorrServer" type="button" class="btn_normal btn_cred MT4" title="ДОБАВИТЬ В TORRSERVER"><i class="fa fa-plus-square"></i> TORRSERVER</button>';
					}
					KZ_ShowButtons = KZ_TorrentButton + KZ_MagnetButton + KZ_CopyMagnetButton + KZ_TorrServerButton;
					set_buttons.innerHTML = `<tbody id="copy_form">
	<tr>
		<td class="nw">${KZ_ShowButtons}</td>
	</tr>
</tbody>`;
				}
				else
				{
					if (KZ_ShowTorrentButton)
					{
						KZ_TorrentButton = '<tr><td style="width: 260px;" class="nw"><button id="DownloadTorrentFile" type="button" class="btn_normal btn_cgreen MT2"><i class="fa fa-download"></i> ТОРРЕНТ ФАЙЛ</button></td><td><b><font color="#00cc00">СКАЧАТЬ ТОРРЕНТ ФАЙЛ</font></b><br>Для того, чтобы скачать эту раздачу - скачайте торрент-файл и запустите его при помощи клиента.</td></tr><tr><td style="height: 4px"></td></tr>';
					}
					if (KZ_ShowMagnetButton)
					{
						KZ_MagnetButton = '<tr><td style="width: 260px;" class="nw"><button id="DownloadMagnet" type="button" class="btn_normal btn_cblue MT2"><i class="fa fa-download"></i> MAGNET</button></td><td><b><font color="#0000cc">СКАЧАТЬ ЧЕРЕЗ MAGNET</font></b><br>Скачивайте сколько угодно, ваш рейтинг не изменится, так как данный метод не затрагивает ваш профиль!</td></tr><tr><td style="height: 4px"></td></tr>';
					}
					if (KZ_ShowCopyMagnetButton)
					{
						KZ_CopyMagnetButton = '<tr><td style="width: 260px;" class="nw"><button id="CopyMagnet" type="button" class="btn_normal btn_cblue MT2"><i class="fa fa-copy"></i> MAGNET</button></td><td><b><font color="#0000cc">СКОПИРОВАТЬ MAGNET</font></b><br>Копирование MAGNET ссылки</td></tr><tr><td style="height: 4px"></td></tr>';
					}
					if (KZ_ShowTorrServerButton)
					{
						KZ_TorrServerButton = '<tr><td style="width: 260px;" class="nw"><button id="AddTorrServer" type="button" class="btn_normal btn_cred MT2"><i class="fa fa-plus-square"></i> TORRSERVER</button></td><td><b><font color="#cc0000">ДОБАВИТЬ В TORRSERVER</font></b><br>Добавление данной раздачи в TorrServer</td></tr><tr><td style="height: 4px"></td></tr>';
					}
					KZ_ShowButtons = KZ_TorrentButton + KZ_MagnetButton + KZ_CopyMagnetButton + KZ_TorrServerButton;
					set_buttons.innerHTML = `<tbody id="copy_form">${KZ_ShowButtons}</tbody>`;
				}
				document.getElementById('copy_form').addEventListener('click', async function (evt)
				{
					var target = evt.target;
					if (target.id === 'CopyMagnet')
					{
						fetch(get_full_url + "/get_srv_details.php?id=" + GetID + "&action=2",
						{
							method: "GET",
						}).then(function (response)
						{
							if (!response.ok)
							{
								throw Error(response.statusText)
							}
							return response.text();
						}).then(function (data)
						{
							copy("magnet:?xt=urn:btih:" + $(data)[0].innerText.match(/[a-zA-Z0-9]{40}/)[0]);
							SwallAutoCloseMsg("Magnet ссылка скопирована!", "2");
						});
					}
					else if (target.id === 'DownloadMagnet')
					{
						fetch(get_full_url + "/get_srv_details.php?id=" + GetID + "&action=2",
						{
							method: "GET",
						}).then(function (response)
						{
							if (!response.ok)
							{
								throw Error(response.statusText)
							}
							return response.text();
						}).then(function (data)
						{
							var hash = "magnet:?xt=urn:btih:" + $(data)[0].innerText.match(/[a-zA-Z0-9]{40}/)[0];
							if (KZ_ShowConfirmDownload)
							{
								Swal.fire(
								{
									title: "СКАЧАТЬ ЧЕРЕЗ MAGNET?",
									html: "<b style='color:#009900;'>Ваш рейтинг не упадёт, можете скачивать бесконечно!</b>",
									icon: 'question',
									showCancelButton: false,
									showDenyButton: true,
									confirmButtonColor: '#4fc823',
									cancelButtonColor: '#d33',
									denyButtonText: "НЕТ",
									confirmButtonText: "ДА",
								}).then(function (result)
								{
									if (result.isConfirmed)
									{
										window.location.href = hash;
										SwallAutoCloseMsg("Скачивается через Magnet!", "2");
									}
								});
							}
							else
							{
								window.location.href = hash;
								SwallAutoCloseMsg("Скачивается через Magnet!", "2");
							}
						});
					}
					else if (target.id === 'DownloadTorrentFile')
					{
						fetch(get_full_url + "/get_srv_details.php?id=" + GetID + "&action=2",
						{
							method: "GET",
						}).then(function (response)
						{
							if (!response.ok)
							{
								throw Error(response.statusText)
							}
							return response.text();
						}).then(function (data)
						{
							if (KZ_ShowConfirmDownload)
							{
								Swal.fire(
								{
									title: "СКАЧАТЬ ТОРРЕНТ ФАЙЛ?",
									html: "<b style='color:#FF0000;'>Ваш рейтинг упадёт, а так же количество скачивании торрентов уменьшится в день!</b>",
									icon: 'question',
									showCancelButton: false,
									showDenyButton: true,
									confirmButtonColor: '#4fc823',
									cancelButtonColor: '#d33',
									denyButtonText: "НЕТ",
									confirmButtonText: "ДА",
								}).then(function (result)
								{
									if (result.value)
									{
										window.location.href = get_full_url + "/download.php?id=" + GetID;
										SwallAutoCloseMsg("Скачивается торрент файл!", "2");
									}
								});
							}
							else
							{
								window.location.href = get_full_url + "/download.php?id=" + GetID;
								SwallAutoCloseMsg("Скачивается торрент файл!", "2");
							}
						});
					}
					else if (target.id === 'AddTorrServer')
					{
						if (GetCAT.match(/45|46|8|6|15|17|35|39|13|14|24|11|10|9|47|18|37|12|7|48|49|50|38|16|21|22|20/) !== null)
						{
							fetch(get_full_url + "/get_srv_details.php?id=" + GetID + "&action=2",
							{
								method: "GET",
							}).then(function (response)
							{
								if (!response.ok)
								{
									throw Error(response.statusText)
								}
								return response.text();
							}).then(function (data)
							{
								var GetHash = "magnet:?xt=urn:btih:" + $(data)[0].innerText.match(/[a-zA-Z0-9]{40}/)[0];
								if (KZ_ShowConfirmDownload)
								{
									Swal.fire(
									{
										title: "ДОБАВИТЬ РАЗДАЧУ В TORRSERVER?",
										icon: 'question',
										showCancelButton: false,
										showDenyButton: true,
										confirmButtonColor: '#4fc823',
										cancelButtonColor: '#d33',
										denyButtonText: "НЕТ",
										confirmButtonText: "ДА",
									}).then(function (result)
									{
										if (result.isConfirmed)
										{
											if (TSVersion === "old")
											{
												let Data = {
													'Link': GetHash,
													'DontSave': !true,
													'Info': JSON.stringify(
													{
														'poster_path': GetImageSrc
													})
												};
												TS_POST("torrent/add", JSON.stringify(Data), (response) =>
												{
													if (/^[0-9a-f]{40}$/i.test(response))
													{
														SwallAutoCloseMsg("Раздача добавлена в TorrServer!", "2");
													}
													else SwallAutoCloseMsg("TorrServer отклонил запрос", "2");
												});
											}
											else
											{
												let Data = {
													'action': 'add',
													'link': GetHash,
													'title': GetFullName,
													'poster': GetImageSrc,
													'save_to_db': true
												};
												TS_POST("torrents", JSON.stringify(Data), (response) =>
												{
													try
													{
														SwallAutoCloseMsg("Раздача добавлена в TorrServer!", "2");
													}
													catch (e)
													{
														console.log("error #7\n" + e);
														SwallAutoCloseMsg("TorrServer отклонил запрос<br>Ошибка:<br><i style=\"color:red\">" + e + "</i>", "5");
													}
												});
											}
										}
									});
								}
								else
								{
									if (TSVersion === "old")
									{
										let Data = {
											'Link': GetHash,
											'DontSave': !true,
											'Info': JSON.stringify(
											{
												'poster_path': GetImageSrc
											})
										};
										TS_POST("torrent/add", JSON.stringify(Data), (response) =>
										{
											if (/^[0-9a-f]{40}$/i.test(response))
											{
												SwallAutoCloseMsg("Раздача добавлена в TorrServer!", "2");
											}
											else SwallAutoCloseMsg("TorrServer отклонил запрос", "2");
										});
									}
									else
									{
										let Data = {
											'action': 'add',
											'link': GetHash,
											'title': GetFullName,
											'poster': GetImageSrc,
											'save_to_db': true
										};
										TS_POST("torrents", JSON.stringify(Data), (response) =>
										{
											try
											{
												SwallAutoCloseMsg("Раздача добавлена в TorrServer!", "2");
											}
											catch (e)
											{
												console.log("error #8\n" + e);
												SwallAutoCloseMsg("TorrServer отклонил запрос<br>Ошибка:<br><i style=\"color:red\">" + e + "</i>", "5");
											}
										});
									}
								}
							});
						}
						else
						{
							SwallAutoCloseMsg("Данная раздача не является фильмом, сериалом, поэтому не может быть добавлена в TorrServer!", "3");
						}
					}
				}, false);
			}
		}
	}
	if (reg_rutor_list.test(get_url))
	{
		var RUTOR_ShowConfirmDownload = RutorCFG.get('ShowConfirmDownload');
		var RUTOR_ShowInfoButton = RutorCFG.get('ShowInfoButton');
		var RUTOR_ShowTorrentButton = RutorCFG.get('ShowTorrentButton');
		var RUTOR_ShowMagnetButton = RutorCFG.get('ShowMagnetButton');
		var RUTOR_ShowCopyMagnetButton = RutorCFG.get('ShowCopyMagnetButton');
		var RUTOR_ShowTorrServerButton = RutorCFG.get('ShowTorrServerButton');
		var RUTOR_SwalDetailedInfoWidth = RutorCFG.get('SwalDetailedInfoWidth');
		var RUTOR_FontSize = RutorCFG.get('FontSize');
		GM_addStyle("div#ws div#content {position: relative;left: 0px;right: auto;}div#index tr a:visited {color: red;}tr.gai td:nth-child(1),tr.tum td:nth-child(1) {width: 110px;}tr.gai td:nth-child(5), tr.tum td:nth-child(5) {width: 160px;}div#index td {font-size: "+RUTOR_FontSize+";}div#index tr a, div#index tr a:hover {text-transform: uppercase;line-height: 1.8;font-weight: bold;text-decoration: none;text-align: left;}.btn_tiny {vertical-align: unset;}#menu {width: auto;height: 40px;background-image: none;background: #ffde02;border: 1px solid #464646;}#menu a {float: left;text-decoration: none;color: #FFFFFF;font-size: 18px;padding: 0px;margin: 4px 4px;}.menu_b div:hover {background-image: unset;color: #333333;text-decoration: none;background: #fff;}.menu_b div {display: block;float: left;color: #666;font-weight: normal;text-align: center;border: 1px solid #bbb;border-radius: 4px;background: #efefef;background: -moz-linear-gradient(top, #fff 0%, #efefef 100%);background: -webkit-gradient(linear, left top, left bottom, color-stop(0%, #fff), color-stop(100%, #efefef));background: -webkit-linear-gradient(top, #fff 0%, #efefef 100%);background: -o-linear-gradient(top, #fff 0%, #efefef 100%);padding: 4px 8px;width: auto;height: auto;cursor: pointer;vertical-align: middle;line-height: normal;}");
		$('#menu').append('<a href="javascript:void(0);" id="rutor_settings" class="menu_b" title="Настройка скрипта"><div><i class="fa fa-cogs"></i> Настройки</div></a>' + (RUTOR_ShowTorrServerButton === true ? '<a href="javascript:void(0);" id="torrserver_settings" class="menu_b" title="Настройка TorrServer"><div><i class="fa fa-cogs"></i> TorrServer</div></a>' : ''));
		$("#menu a#rutor_settings").click(function ()
		{
			GM_addStyle(".swal-settings-label {cursor: pointer;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;font-size: 12px;display: block;padding: 6px 10px;}.swal-settings-label p {font-size: 11px;margin: 0px 0px 0px 0px;padding: 2px 0px 0px 0px;}.swal-settings-select:focus, .swal-settings-color:focus, .swal-settings-input:focus, .swal-settings-textarea:focus {border: 1px solid rgb(100 160 224);outline: 0;box-shadow: 0 0 0 3px rgb(85 142 202 / 50%);}.swal-settings-select, .swal-settings-input, .swal-settings-textarea {transition: border-color .3s,box-shadow .3s;border: 1px solid #767676;font-size: 14px;padding: 4px;margin: 0px 5px 0px 0px;border-radius: 5px;width: auto;}.swal-settings-color {transition: border-color .3s,box-shadow .3s;margin: 0px;border-radius: 5px;width: 30px;height: 30px;}.swal-settings-buttons{text-align: center;}.swal-settings-title {padding: 4px 0px;font-size: 14px;font-weight: bold;text-align: center;}.swal-settings-title p {font-size: 11px;font-weight: bold;}.swal-settings-maintitle{position: relative;max-width: 100%;padding: 0px;color: #ff0000;font-size: 12px;font-weight: bold;text-align: center;text-transform: none;}*, *::before, *::after {box-sizing: unset;}");
			RutorCFG.open();
		});
		$("#menu a#torrserver_settings").click(function ()
		{
			GM_addStyle(".swal-settings-label {cursor: pointer;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;font-size: 12px;display: block;padding: 6px 10px;}.swal-settings-label p {font-size: 11px;margin: 0px 0px 0px 0px;padding: 2px 0px 0px 0px;}.swal-settings-select:focus, .swal-settings-color:focus, .swal-settings-input:focus, .swal-settings-textarea:focus {border: 1px solid rgb(100 160 224);outline: 0;box-shadow: 0 0 0 3px rgb(85 142 202 / 50%);}.swal-settings-select, .swal-settings-input, .swal-settings-textarea {transition: border-color .3s,box-shadow .3s;border: 1px solid #767676;font-size: 14px;padding: 4px;margin: 0px 5px 0px 0px;border-radius: 5px;width: auto;}.swal-settings-color {transition: border-color .3s,box-shadow .3s;margin: 0px;border-radius: 5px;width: 30px;height: 30px;}.swal-settings-buttons{text-align: center;}.swal-settings-title {padding: 4px 0px;font-size: 14px;font-weight: bold;text-align: center;}.swal-settings-title p {font-size: 11px;font-weight: bold;}.swal-settings-maintitle{position: relative;max-width: 100%;padding: 0px;color: #ff0000;font-size: 12px;font-weight: bold;text-align: center;text-transform: none;}*, *::before, *::after {box-sizing: unset;}");
			TorrServerCFG.open();
		});
		if ($("#menu > #menu_right_side")[0].outerHTML.match(/zaiti.gif/im) !== null)
		{
			$("#menu > #menu_right_side")[0].innerHTML = '<span style="float: right;"><button onclick="location.href=\'/users.php\';" type="button" class="btn_small btn_cred MT6"><i class="fa fa-sign-in"></i> ВХОД</button><span>';
		}
		else if ($("#menu > #menu_right_side")[0].outerHTML.match(/viti.gif/im) !== null)
		{
			$("#menu > #menu_right_side")[0].innerHTML = '<span style="float: right;"><button onclick="location.href=\'/profile.php\';" type="button" class="btn_small btn_cred"><i class="fa fa fa-user"></i> ПРОФИЛЬ</button><button onclick="location.href=\'/users.php?logout\';" type="button" class="btn_small btn_cred MT6"><i class="fa fa-sign-out"></i> ВЫХОД</button><span>';
		}
		$('.tum,.gai').each(function (i, el)
		{
			var GetURLID = $(el).find("a:nth-child(3)")[0].href.match(/torrent\/([0-9]+)\//)[1];
			var GetTitle = $(el).find("a:nth-child(3)")[0].innerText.toUpperCase();
			var GetHash = $(el).find("a:nth-child(2)")[0].href.match(/(magnet:\?xt=urn:btih:[a-z\d]{40})/im)[0];
			$(el).find("td:nth-child(2)")[0].innerHTML = `${(!RUTOR_ShowInfoButton ? '<button id="get_info_'+GetURLID+'" type="button" class="btn_tiny btn_corange MT2" style="padding: 5px 13px;font-size:22px;" title="ИНФОРМАЦИЯ О РАЗДАЧЕ"><i class="fa fa-info"></i></button>':"")}${(RUTOR_ShowTorrentButton ? '<button id="download_torrent_'+GetURLID+'" type="button" class="btn_tiny btn_cgreen MT2" style="padding: 5px 8px;font-size:22px;" title="СКАЧАТЬ ТОРРЕНТ ФАЙЛ"><i class="fa fa-download"></i></button>':"")}${(RUTOR_ShowMagnetButton ? '<button id="download_magnet_'+GetURLID+'" type="button" class="btn_tiny btn_cblue MT2" style="padding: 5px 8px;font-size:22px;" title="СКАЧАТЬ ЧЕРЕЗ MAGNET"><i class="fa fa-magnet"></i></button>':"")}${(RUTOR_ShowCopyMagnetButton ? '<button id="copy_magnet_'+GetURLID+'" type="button" class="btn_tiny btn_cblue MT2" style="padding: 5px 8px;font-size:22px;" title="СКОПИРОВАТЬ MAGNET ССЫЛКУ"><i class="fa fa-copy"></i></button>':"")}${(RUTOR_ShowTorrServerButton ? '<button id="add_torrserver_'+GetURLID+'" type="button" class="btn_tiny btn_cred MT2" style="padding: 5px 8px;font-size:22px;" title="ДОБАВИТЬ В TORRSERVER"><i class="fa fa-plus-square"></i></button>':"")}${(!RUTOR_ShowInfoButton ? ' <a href="'+get_full_url+'/torrent/'+GetURLID+'/">'+GetTitle+'</a>':' <a href="javascript:void(0);" id="get_info_'+GetURLID+'" title="ИНФОРМАЦИЯ О РАЗДАЧЕ '+GetTitle+'">'+GetTitle+'</a>')}`;
			$("#get_info_" + GetURLID).click(function ()
			{
				fetch(get_full_url + "/torrent/" + GetURLID,
				{
					method: "GET",
				}).then(function (response)
				{
					if (!response.ok)
					{
						throw Error(response.statusText)
					}
					return response.text();
				}).then(function (data)
				{
					var get_info = "",
						check_movie = "",
						youtube_link = "",
						ads = "",
						ads_result = "",
						get_data = $(data);
					get_info = get_data.find('#details > tbody > tr:nth-child(1)')[0].innerHTML;
					ads = get_data.find('#details > tbody > tr:nth-child(1)')[0].textContent.trim().toLowerCase();
					if (ads.match(match_no_ads))
					{
						ads_result = '<div class="fnm-ads-title fnm-no-ads">РАЗДАЧА БЕЗ РЕКЛАМЫ</div>';
					}
					else if (ads.match(match_with_ads))
					{
						ads_result = '<div class="fnm-ads-title fnm-with-ads">ПРИСУТСТВУЕТ РЕКЛАМА</div>';
					}
					check_movie = get_data.find('#details > tbody > tr:nth-child(1)')[0].textContent.trim().toLowerCase().match(/(арт-хаус|биография|боевик|вестерн|военный|детектив|детский|драма|исторический|комедия|короткометражка|криминал|мелодрама|мистика|мюзикл|нуар|пародия|приключения|романтика|семейный|сказка|советское|кино|спорт|триллер|ужасы|фантастика|фэнтези|эротика)/);
					youtube_link = (check_movie ? '<button type="button" class="btn_small btn_cred MT4" onclick="window.open(\'https://www.youtube.com/results?search_query=' + fixedEncodeURIComponent(GetTitle+' русский трейлер') + '\')" style="display: block;margin-left: auto;margin-right: auto;">YOUTUBE ТРЕЙЛЕР</button>' : '');
					Swal.fire(
					{
						width: RUTOR_SwalDetailedInfoWidth,
						html: `<h2 class="swal2-title fnm-title">ИНФОРМАЦИЯ</h2>${ads_result}` + get_info,
						showConfirmButton: false,
						showCancelButton: false,
						footer: "<center>" +youtube_link+ (!RUTOR_ShowInfoButton ? '<button type="button" id="cancel" class="btn_small btn_cred MT4">ЗАКРЫТЬ</button>' : '<button type="button" onclick="window.open(\'' + get_full_url + '/torrent/' + GetURLID + '\',\'_self\')" class="btn_small btn_cblue MT4">ОТКРЫТЬ РАЗДАЧУ</button> <button type="button" id="cancel" class="btn_small btn_cred MT4">ЗАКРЫТЬ</button>') + "</center>",
						didOpen: () =>
						{
							Swal.getFooter().querySelector('button#cancel').focus();
						}
					});
				});
			});
			$("#download_torrent_" + GetURLID).click(function ()
			{
				if (RUTOR_ShowConfirmDownload)
				{
					Swal.fire(
					{
						title: "СКАЧАТЬ ТОРРЕНТ ФАЙЛ?",
						icon: 'question',
						showCancelButton: false,
						showDenyButton: true,
						confirmButtonColor: '#4fc823',
						cancelButtonColor: '#d33',
						denyButtonText: "НЕТ",
						confirmButtonText: "ДА",
					}).then(function (result)
					{
						if (result.value)
						{
							window.location.href = get_full_url + "/download/" + GetURLID;
							SwallAutoCloseMsg("Скачивается торрент файл!", "2");
						}
					});
				}
				else
				{
					window.location.href = get_full_url + "/download/" + GetURLID;
					SwallAutoCloseMsg("Скачивается торрент файл!", "2");
				}
			});
			$("#download_magnet_" + GetURLID).click(function ()
			{
				if (RUTOR_ShowConfirmDownload)
				{
					Swal.fire(
					{
						title: "СКАЧАТЬ ЧЕРЕЗ MAGNET?",
						icon: 'question',
						showCancelButton: false,
						showDenyButton: true,
						confirmButtonColor: '#4fc823',
						cancelButtonColor: '#d33',
						denyButtonText: "НЕТ",
						confirmButtonText: "ДА",
					}).then(function (result)
					{
						if (result.value)
						{
							window.location.href = GetHash;
							SwallAutoCloseMsg("Скачивается через Magnet!", "2");
						}
					});
				}
				else
				{
					window.location.href = GetHash;
					SwallAutoCloseMsg("Скачивается через Magnet!", "2");
				}
			});
			$("#copy_magnet_" + GetURLID).click(function ()
			{
				copy(GetHash);
				SwallAutoCloseMsg("Magnet ссылка скопирована!", "2");
			});
			$("#add_torrserver_" + GetURLID).click(function ()
			{
				fetch(get_full_url + "/torrent/" + GetURLID,
				{
					method: "GET",
				}).then(function (response)
				{
					return response.text();
				}).then(function (data)
				{
					var get_img_url = "",
						get_data = $(data);
					if (get_data.find("#details")[0].innerText.match(/Категория(.*)/)[1].match(/Зарубежные фильмы|Наши фильмы|Научно-популярные фильмы|Телевизор|Зарубежные сериалы|Наши сериалы|Аниме/) !== null)
					{
						get_img_url = get_data.find("#details img")[0].src;
						if (RUTOR_ShowConfirmDownload)
						{
							Swal.fire(
							{
								title: "ДОБАВИТЬ В TORRSERVER?",
								icon: 'question',
								showCancelButton: false,
								showDenyButton: true,
								confirmButtonColor: '#4fc823',
								cancelButtonColor: '#d33',
								denyButtonText: "НЕТ",
								confirmButtonText: "ДА",
							}).then(function (result)
							{
								if (result.value)
								{
									if (TSVersion === "old")
									{
										let Data = {
											'Link': GetHash,
											'DontSave': !true,
											'Info': JSON.stringify(
											{
												'poster_path': get_img_url
											})
										};
										TS_POST("torrent/add", JSON.stringify(Data), (response) =>
										{
											if (/^[0-9a-f]{40}$/i.test(response))
											{
												SwallAutoCloseMsg("Раздача добавлена в TorrServer!", "2");
											}
											else SwallAutoCloseMsg("TorrServer отклонил запрос", "2");
										});
									}
									else
									{
										let Data = {
											'action': 'add',
											'link': GetHash,
											'title': GetTitle,
											'poster': get_img_url,
											'save_to_db': true
										};
										TS_POST("torrents", JSON.stringify(Data), (response) =>
										{
											try
											{
												SwallAutoCloseMsg("Раздача добавлена в TorrServer!", "2");
											}
											catch (e)
											{
												console.log("error #9\n" + e);
												SwallAutoCloseMsg("TorrServer отклонил запрос<br>Ошибка:<br><i style=\"color:red\">" + e + "</i>", "5");
											}
										});
									}
								}
							});
						}
						else
						{
							if (TSVersion === "old")
							{
								let Data = {
									'Link': GetHash,
									'DontSave': !true,
									'Info': JSON.stringify(
									{
										'poster_path': get_img_url
									})
								};
								TS_POST("torrent/add", JSON.stringify(Data), (response) =>
								{
									if (/^[0-9a-f]{40}$/i.test(response))
									{
										SwallAutoCloseMsg("Раздача добавлена в TorrServer!", "2");
									}
									else SwallAutoCloseMsg("TorrServer отклонил запрос", "2");
								});
							}
							else
							{
								let Data = {
									'action': 'add',
									'link': GetHash,
									'title': GetTitle,
									'poster': get_img_url,
									'save_to_db': true
								};
								TS_POST("torrents", JSON.stringify(Data), (response) =>
								{
									try
									{
										SwallAutoCloseMsg("Раздача добавлена в TorrServer!", "2");
									}
									catch (e)
									{
										console.log("error #10\n" + e);
										SwallAutoCloseMsg("TorrServer отклонил запрос<br>Ошибка:<br><i style=\"color:red\">" + e + "</i>", "5");
									}
								});
							}
						}
					}
					else
					{
						SwallAutoCloseMsg("Данная раздача не является фильмом или сериалом, поэтому не может быть добавлена в TorrServer!", "3");
					}
				});
			});
		});
	}
	if (/rutracker.org\/forum\/tracker.php/.test(get_url))
	{
		let el = document.querySelector(".seed-leech");
		el.dispatchEvent(new MouseEvent('mousedown'));
		el.dispatchEvent(new MouseEvent('mouseup'));
	}
	if (reg_rutracker.test(get_url))
	{
		GM_addStyle(".checkboxToggle {padding: 0px;}.btn_tiny {vertical-align: unset;}");
		var RT_ShowConfirmDownload = RuTrackerCFG.get('ShowConfirmDownload');
		var RT_ShowInfoButton = RuTrackerCFG.get('ShowInfoButton');
		var RT_ShowTorrentButton = RuTrackerCFG.get('ShowTorrentButton');
		var RT_ShowMagnetButton = RuTrackerCFG.get('ShowMagnetButton');
		var RT_ShowCopyMagnetButton = RuTrackerCFG.get('ShowCopyMagnetButton');
		var RT_ShowTorrServerButton = RuTrackerCFG.get('ShowTorrServerButton');
		var RT_SwalDetailedInfoWidth = RuTrackerCFG.get('SwalDetailedInfoWidth');
		$('#top-login-box,#logged-in-username').parent().append('<button id="rutracker_settings" class="bold" style="margin-left: 10px;height: auto;border: 1px solid gray;border-radius: 4px;font-size: 12px;padding: 3px 8px;"><i class="fa fa-cogs"></i> Настройки</button>' + (RT_ShowTorrServerButton === true ? '<button id="torrserver_settings" class="bold" style="margin-left: 10px;height: auto;border: 1px solid gray;border-radius: 4px;font-size: 12px;padding: 3px 8px;"><i class="fa fa-cogs"></i> TorrServer</button>' : ''));
		$("#rutracker_settings").click(function ()
		{
			GM_addStyle("*, *::before, *::after {box-sizing: unset;}.swal-settings-label {cursor: pointer;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;font-size: 12px;display: block;padding: 6px 10px;}.swal-settings-label p {font-size: 11px;margin: 0px 0px 0px 0px;padding: 2px 0px 0px 0px;}.swal-settings-select:focus, .swal-settings-color:focus, .swal-settings-input:focus, .swal-settings-textarea:focus {border: 1px solid rgb(100 160 224);outline: 0;box-shadow: 0 0 0 3px rgb(85 142 202 / 50%);}.swal-settings-select, .swal-settings-input, .swal-settings-textarea {transition: border-color .3s,box-shadow .3s;border: 1px solid #767676;font-size: 14px;padding: 4px;margin: 0px 5px 0px 0px;border-radius: 5px;width: auto;}.swal-settings-color {transition: border-color .3s,box-shadow .3s;margin: 0px;border-radius: 5px;width: 30px;height: 30px;}.swal-settings-buttons{text-align: center;}.swal-settings-title {padding: 4px 0px;font-size: 14px;font-weight: bold;text-align: center;}.swal-settings-title p {font-size: 11px;font-weight: bold;}.swal-settings-maintitle{position: relative;max-width: 100%;padding: 0px;color: #ff0000;font-size: 12px;font-weight: bold;text-align: center;text-transform: none;}");
			RuTrackerCFG.open();
		});
		$("#torrserver_settings").click(function ()
		{
			GM_addStyle("*, *::before, *::after {box-sizing: unset;}.swal-settings-label {cursor: pointer;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;font-size: 12px;display: block;padding: 6px 10px;}.swal-settings-label p {font-size: 11px;margin: 0px 0px 0px 0px;padding: 2px 0px 0px 0px;}.swal-settings-select:focus, .swal-settings-color:focus, .swal-settings-input:focus, .swal-settings-textarea:focus {border: 1px solid rgb(100 160 224);outline: 0;box-shadow: 0 0 0 3px rgb(85 142 202 / 50%);}.swal-settings-select, .swal-settings-input, .swal-settings-textarea {transition: border-color .3s,box-shadow .3s;border: 1px solid #767676;font-size: 14px;padding: 4px;margin: 0px 5px 0px 0px;border-radius: 5px;width: auto;}.swal-settings-color {transition: border-color .3s,box-shadow .3s;margin: 0px;border-radius: 5px;width: 30px;height: 30px;}.swal-settings-buttons{text-align: center;}.swal-settings-title {padding: 4px 0px;font-size: 14px;font-weight: bold;text-align: center;}.swal-settings-title p {font-size: 11px;font-weight: bold;}.swal-settings-maintitle{position: relative;max-width: 100%;padding: 0px;color: #ff0000;font-size: 12px;font-weight: bold;text-align: center;text-transform: none;}");
			TorrServerCFG.open();
		});
		$('tr.hl-tr').each(function (i, el)
		{
			var url = $(el).find('.tt-text,.tLink').attr('href');
			var GetURLID = url.match(/[0-9]+/g)[0];
			if ($(el).find('td.vf-col-tor.tCenter.med.nowrap > div > div.small > a,td.row4.small.nowrap.tor-size > a').length == 1)
			{
				$(el).find('.tt,.t-title-col').prepend(`<div style="float:left;margin: 0px 9px 0px 0px">${(RT_ShowInfoButton ? '<button id="get_info_'+GetURLID+'" type="button" class="btn_tiny btn_corange MT2" style="padding: 0px 11px;font-size:18px;" title="ИНФОРМАЦИЯ О РАЗДАЧЕ"><i class="fa fa-info"></i></button>':"")}${(RT_ShowTorrentButton ? '<button id="download_torrent_'+GetURLID+'" type="button" class="btn_tiny btn_cgreen MT2" style="padding: 0px 6px;font-size:18px;" title="СКАЧАТЬ ТОРРЕНТ ФАЙЛ"><i class="fa fa-download"></i></button>':"")}${(RT_ShowMagnetButton ? '<button id="download_magnet_'+GetURLID+'" type="button" class="btn_tiny btn_cblue MT2" style="padding: 0px 6px;font-size:18px;" title="СКАЧАТЬ ЧЕРЕЗ MAGNET"><i class="fa fa-magnet"></i></button>':"")}${(RT_ShowCopyMagnetButton ? '<button id="copy_magnet_'+GetURLID+'" type="button" class="btn_tiny btn_cblue MT2" style="padding: 0px 6px;font-size:18px;" title="СКОПИРОВАТЬ MAGNET ССЫЛКУ"><i class="fa fa-copy"></i></button>':"")}${(RT_ShowTorrServerButton ? '<button id="add_torrserver_'+GetURLID+'" type="button" class="btn_tiny btn_cred MT2" style="padding: 0px 6px;font-size:18px;" title="ДОБАВИТЬ В TORRSERVER"><i class="fa fa-plus-square"></i></button>':"")}</div> `);
			}
			$("#get_info_" + GetURLID).click(function ()
			{
				fetch(get_full_url + "/forum/viewtopic.php?t=" + GetURLID,
				{
					method: "GET",
				}).then(windows1251ResponseToUTF8Response).then(function (response)
				{
					if (!response.ok)
					{
						throw Error(response.statusText)
					}
					return response.text();
				}).then(function (data)
				{
					var get_info = "",
						get_data = $(data),
						check_movie = "",
						youtube_link = "",
						ads = "",
						ads_result = "",
						GetTitle = get_data.find('#soc-container').attr('data-share_title');
					if (get_data.find('[data-topic_id="' + GetURLID + '"]').length == 1)
					{
						get_info = get_data.find('.post_body')[0].outerHTML;
						ads = get_data.find('.post_body')[0].textContent.trim().toLowerCase();
						if (ads.match(match_no_ads))
						{
							ads_result = '<div class="fnm-ads-title fnm-no-ads">РАЗДАЧА БЕЗ РЕКЛАМЫ</div>';
						}
						else if (ads.match(match_with_ads))
						{
							ads_result = '<div class="fnm-ads-title fnm-with-ads">ПРИСУТСТВУЕТ РЕКЛАМА</div>';
						}
						check_movie = get_data.find('.post_body')[0].textContent.trim().toLowerCase().match(/(арт-хаус|биография|боевик|вестерн|военный|детектив|детский|драма|исторический|комедия|короткометражка|криминал|мелодрама|мистика|мюзикл|нуар|пародия|приключения|романтика|семейный|сказка|советское|кино|спорт|триллер|ужасы|фантастика|фэнтези|эротика)/);
						youtube_link = (check_movie ? '<button type="button" class="btn_small btn_cred MT4" onclick="window.open(\'https://www.youtube.com/results?search_query=' + fixedEncodeURIComponent(GetTitle+' русский трейлер') + '\')" style="display: block;margin-left: auto;margin-right: auto;">YOUTUBE ТРЕЙЛЕР</button>' : '');
					}
					Swal.fire(
					{
						width: RT_SwalDetailedInfoWidth,
						html: `<h2 class="swal2-title fnm-title">ИНФОРМАЦИЯ</h2>${ads_result}` + get_info,
						showConfirmButton: false,
						showCancelButton: false,
						footer: '<center>'+youtube_link+'<button type="button" id="cancel" class="btn_small btn_cred MT4">ЗАКРЫТЬ</button></center>',
						didOpen: () =>
						{
							Swal.getFooter().querySelector('button#cancel').focus();
							$('div.post_body, div.signature').each(function ()
							{
								BB.initPost(this);
							});
							BB.initPost = function (e)
							{
								var t = $(e);
								BB.initSpoilers(t);
							};
							BB.initSpoilers = function (e)
							{
								if (e.hasClass('signature'))
								{
									return;
								}
								e.off('.spoiler');
								e.on('click.spoiler', 'div.sp-head', function (e)
								{
									var t = $(this);
									var n = t.next('div.sp-body');
									var i = t.parent('div.sp-wrap');
									if (!n.hasClass('inited'))
									{
										BB.initPostImages(n);
										var r = $('<div class="sp-fold clickable">[свернуть]</div>').on('click', function ()
										{
											$.scrollTo(t,
											{
												duration: 200,
												axis: 'y',
												offset: -200
											});
											t.click().animate(
											{
												opacity: .1
											}, 500).animate(
											{
												opacity: 1
											}, 700);
										});
										n.append(r).addClass('clearfix inited');
										n.parent().addClass('clearfix');
									}
									if (e.shiftKey)
									{
										t.css('user-select', 'none');
										e.stopPropagation();
										e.shiftKey = false;
										var s = t.hasClass('unfolded');
										$('div.sp-head', $(n.parents('td')[0])).not('.sp-no-auto-open').filter(function ()
										{
											return $(this).hasClass('unfolded') ? s : !s;
										}).click();
									}
									else
									{
										t.toggleClass('unfolded');
										i.toggleClass('sp-opened');
										n.slideToggle('fast');
									}
								});
							};
						}
					});
				});
			});
			$("#download_torrent_" + GetURLID).click(function ()
			{
				if (RT_ShowConfirmDownload)
				{
					Swal.fire(
					{
						title: "СКАЧАТЬ ТОРРЕНТ ФАЙЛ?",
						icon: 'question',
						showCancelButton: false,
						showDenyButton: true,
						confirmButtonColor: '#4fc823',
						cancelButtonColor: '#d33',
						denyButtonText: "НЕТ",
						confirmButtonText: "ДА",
					}).then(function (result)
					{
						if (result.value)
						{
							window.location.href = get_full_url + "/download.php?id=" + GetID;
							SwallAutoCloseMsg("Скачивается торрент файл!", "2");
						}
					});
				}
				else
				{
					window.location.href = get_full_url + "/forum/dl.php?t=" + GetURLID;
					SwallAutoCloseMsg("Скачивается торрент файл!", "2");
				}
			});
			$("#download_magnet_" + GetURLID).click(function ()
			{
				fetch(get_full_url + "/forum/viewtopic.php?t=" + GetURLID,
				{
					method: "GET",
				}).then(windows1251ResponseToUTF8Response).then(function (response)
				{
					if (!response.ok)
					{
						throw Error(response.statusText)
					}
					return response.text();
				}).then(function (data)
				{
					var GetHash = "",
						GetTitle = "",
						GetImageSrc = "",
						get_data = $(data);
					if (get_data.find('[data-topic_id="' + GetURLID + '"]').length == 1)
					{
						if (get_data.find('.postImgAligned')[0])
						{
							GetImageSrc = get_data.find('.postImgAligned')[0].title;
						}
						GetTitle = get_data.find('#soc-container')[0].attributes[2].value;
						GetHash = get_data.find('[data-topic_id="' + GetURLID + '"]')[0].href.match(/(magnet:\?xt=urn:btih:[a-z\d]{40})/im)[0];
						if (RT_ShowConfirmDownload)
						{
							Swal.fire(
							{
								html: `
<h2 class="swal2-title fnm-title">СКАЧАТЬ ЧЕРЕЗ MAGNET?</h2>
<table>
<tr>
<td style="vertical-align:top;padding: 0px 10px 0px 0px;font-size: 12px;">
<div>
<h2>${GetTitle}</h2>
<img src="${GetImageSrc}" style="display: block;margin-left: auto;margin-right: auto;width: 200px;" alt=""></center></td>
</tr>
</table>`,
								showCancelButton: false,
								showDenyButton: true,
								confirmButtonColor: '#4fc823',
								cancelButtonColor: '#d33',
								denyButtonText: "НЕТ",
								confirmButtonText: "ДА",
							}).then(function (result)
							{
								if (result.value)
								{
									window.location.href = GetHash;
									SwallAutoCloseMsg("Скачивается через Magnet!", "2");
								}
							});
						}
						else
						{
							window.location.href = GetHash;
							SwallAutoCloseMsg("Скачивается через Magnet!", "2");
						}
					}
				});
			});
			$("#copy_magnet_" + GetURLID).click(function ()
			{
				fetch(get_full_url + "/forum/viewtopic.php?t=" + GetURLID,
				{
					method: "GET",
				}).then(windows1251ResponseToUTF8Response).then(function (response)
				{
					if (!response.ok)
					{
						throw Error(response.statusText)
					}
					return response.text();
				}).then(function (data)
				{
					var GetHash = "",
						GetTitle = "",
						get_data = $(data);
					if (get_data.find('[data-topic_id="' + GetURLID + '"]').length == 1)
					{
						GetTitle = get_data.find('#soc-container')[0].attributes[2].value;
						GetHash = get_data.find('[data-topic_id="' + GetURLID + '"]')[0].href.match(/(magnet:\?xt=urn:btih:[a-z\d]{40})/im)[0];
						copy(GetHash);
						SwallAutoCloseMsg("Magnet ссылка скопирована!", "2");
					}
				});
			});
			$("#add_torrserver_" + GetURLID).click(function ()
			{
				fetch(get_full_url + "/forum/viewtopic.php?t=" + GetURLID,
				{
					method: "GET",
				}).then(windows1251ResponseToUTF8Response).then(function (response)
				{
					if (!response.ok)
					{
						throw Error(response.statusText)
					}
					return response.text();
				}).then(function (data)
				{
					var GetHash = "",
						GetTitle = "",
						GetImageSrc = "",
						get_data = $(data);
					if (get_data.find('[data-topic_id="' + GetURLID + '"]').length == 1)
					{
						if (get_data.find('.postImgAligned')[0])
						{
							GetImageSrc = get_data.find('.postImgAligned')[0].title;
						}
						GetTitle = get_data.find('#soc-container')[0].attributes[2].value;
						GetHash = get_data.find('[data-topic_id="' + GetURLID + '"]')[0].href.match(/(magnet:\?xt=urn:btih:[a-z\d]{40})/im)[0];
						if (RT_ShowConfirmDownload)
						{
							Swal.fire(
							{
								html: `
<h2 class="swal2-title fnm-title">ДОБАВИТЬ В TORRSERVER?</h2>
<table>
<tr>
<td style="vertical-align:top;padding: 0px 10px 0px 0px;font-size: 12px;">
<div>
<h2>${GetTitle}</h2>
<img src="${GetImageSrc}" style="display: block;margin-left: auto;margin-right: auto;width: 200px;" alt=""></center></td>
</tr>
</table>`,
								showCancelButton: false,
								showDenyButton: true,
								confirmButtonColor: '#4fc823',
								cancelButtonColor: '#d33',
								denyButtonText: "НЕТ",
								confirmButtonText: "ДА",
							}).then(function (result)
							{
								if (result.value)
								{
									if (TSVersion === "old")
									{
										let Data = {
											'Link': GetHash,
											'DontSave': !true,
											'Info': JSON.stringify(
											{
												'poster_path': GetImageSrc
											})
										};
										TS_POST("torrent/add", JSON.stringify(Data), (response) =>
										{
											if (/^[0-9a-f]{40}$/i.test(response))
											{
												SwallAutoCloseMsg("Раздача добавлена в TorrServer!", "2");
											}
											else SwallAutoCloseMsg("TorrServer отклонил запрос", "2");
										});
									}
									else
									{
										let Data = {
											'action': 'add',
											'link': GetHash,
											'title': GetTitle,
											'poster': GetImageSrc,
											'save_to_db': true
										};
										TS_POST("torrents", JSON.stringify(Data), (response) =>
										{
											try
											{
												SwallAutoCloseMsg("Раздача добавлена в TorrServer!", "2");
											}
											catch (e)
											{
												console.log("error #11\n" + e);
												SwallAutoCloseMsg("TorrServer отклонил запрос<br>Ошибка:<br><i style=\"color:red\">" + e + "</i>", "5");
											}
										});
									}
								}
							});
						}
						else
						{
							if (TSVersion === "old")
							{
								let Data = {
									'Link': GetHash,
									'DontSave': !true,
									'Info': JSON.stringify(
									{
										'poster_path': GetImageSrc
									})
								};
								TS_POST("torrent/add", JSON.stringify(Data), (response) =>
								{
									if (/^[0-9a-f]{40}$/i.test(response))
									{
										SwallAutoCloseMsg("Раздача добавлена в TorrServer!", "2");
									}
									else SwallAutoCloseMsg("TorrServer отклонил запрос", "2");
								});
							}
							else
							{
								let Data = {
									'action': 'add',
									'link': GetHash,
									'title': GetTitle,
									'poster': GetImageSrc,
									'save_to_db': true
								};
								TS_POST("torrents", JSON.stringify(Data), (response) =>
								{
									try
									{
										SwallAutoCloseMsg("Раздача добавлена в TorrServer!", "2");
									}
									catch (e)
									{
										console.log("error #12\n" + e);
										SwallAutoCloseMsg("TorrServer отклонил запрос<br>Ошибка:<br><i style=\"color:red\">" + e + "</i>", "5");
									}
								});
							}
						}
					}
				});
			});
		});
	}
})();
