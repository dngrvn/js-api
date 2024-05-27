/* Цель: Разработать веб-приложение, которое каждый день будет отображать новое случайное изображение из коллекции Unsplash, 
	давая пользователю возможность узнать больше о фотографе и сделать "лайк" изображению.

Регистрация на Unsplash:

	• Перейдите на веб-сайт Unsplash (https://unsplash.com/).
	• Зарегистрируйтесь или войдите в свой аккаунт. (если у вас не было регистрации до этого, новый аккаунт создавать не нужно).

Создание приложения:

	• Перейдите на страницу разработчика Unsplash (https://unsplash.com/developers).
	• Нажмите "New Application".
	• Заполните необходимую информацию о приложении (можете использовать http://localhost для тестирования).
	• Получите свой API-ключ после создания приложения.

Разработка веб-приложения:

	• Создайте HTML-страницу с элементами: изображение, имя фотографа, кнопка "лайк" и счетчик лайков.
	• Используя JavaScript и ваш API-ключ, получите случайное изображение из Unsplash каждый раз, когда пользователь загружает страницу.
	• Отобразите информацию о фотографе под изображением.

* Дополнительные задачи (по желанию):

	• Реализуйте функционал "лайка". Каждый раз, когда пользователь нажимает кнопку "лайк", счетчик должен увеличиваться на единицу.
	• Добавьте функцию сохранения количества лайков в локальное хранилище, чтобы при новой загрузке страницы счетчик не сбрасывался.
	• Реализуйте возможность просмотра предыдущих "фото дня" с сохранением их в истории просмотров
*/

const photoContainer = document.getElementById('photo-container');
let page = 1;
let likes = 0;
let totalLikes = 0;
const likesTotalKey = 'unsplashLikes';
getLikesFromStorage();

async function fetchPhotos() {
	try {
		const response = await fetch(
			// `https://api.unsplash.com/photos?page=${page}&per_page=10&client_id=GrVGh3EE2oIzJstDFWOGs3wuqhHir428G0UjYD0BZq0`
			`https://api.unsplash.com/photos/random?page=${page}&per_page=10&client_id=GrVGh3EE2oIzJstDFWOGs3wuqhHir428G0UjYD0BZq0`
		);
		const photos = await response.json();
		return photos;
	} catch (error) {
		console.error('Ошибка при загрузке фотографий: ', error);
		return [];
	}
}

// создание контента
async function loadMorePhotos() {
	// Получаем данные с Unsplash
	const photos = await fetchPhotos();
	console.log('photos: ', photos);

	// Очищаем контейнер
	photoContainer.innerHTML = ``;

	// Если получен массив фотографий:
	if (photos.length) {
		// Перебираем полученный архив, выбирая и выводя на экран фото и имя автора
		photos.forEach((photo) => {
			renderToDOM(photo);
		});
		// Если получена единичная рандомная фотография
	} else {
		// Выводим её на экран
		renderToDOM(photos);
	}
}

function renderToDOM(photo) {
	// Выбираем адрес маленького изображения:
	const photoElem = photo.urls.small;

	// Выбираем имя автора
	const photoAuthor = photo.user.name;

	photoContainer.insertAdjacentHTML(
		'afterbegin',
		`
		<div class="photoUnit">
			<div class="photo"><img src="${photoElem}" alt=""></div>
			<p>${photoAuthor}</p>
			<div class="likes-div">
				<span class="photo-id">Photo Id=${photo.id}</span>
				<span>Photo Likes:</span>
				<span class="likes-counter">${likes}</span>
				<button class="likes-btn">I like 
					<?xml version="1.0" standalone="no"?>
					<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 20010904//EN"
					"http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd">
						<svg version="1.0" xmlns="http://www.w3.org/2000/svg"
						width="11.000000pt" height="10.000000pt" viewBox="0 0 11.000000 10.000000"
						preserveAspectRatio="xMidYMid meet">
							<g transform="translate(0.000000,10.000000) scale(0.000600000,-0.000600000)"
							fill="" stroke="#ff0000">
							<path d="M3300 11879 c-41 -4 -127 -13 -190 -19 -1345 -137 -2509 -1081 -2929
							-2373 -92 -285 -130 -484 -172 -912 -22 -230 19 -755 87 -1110 202 -1050 721
							-1930 1730 -2940 338 -338 530 -513 1544 -1407 1220 -1075 1863 -1733 2502
							-2558 140 -181 384 -519 394 -545 5 -12 30 -15 133 -15 l127 0 16 28 c39 66
							282 412 401 572 420 564 917 1121 1498 1680 377 363 638 600 1454 1325 929
							826 1400 1299 1806 1815 721 916 1048 1786 1096 2915 5 117 -2 221 -33 490
							-116 1004 -680 1917 -1534 2482 -433 286 -953 481 -1450 542 -317 40 -501 48
							-649 31 -47 -6 -147 -17 -221 -25 -938 -105 -1802 -610 -2383 -1392 -41 -57
							-84 -116 -93 -133 -23 -38 -45 -38 -68 0 -72 124 -279 374 -446 540 -548 548
							-1274 900 -2030 985 -74 8 -174 19 -221 25 -98 11 -258 11 -369 -1z"/>
							</g>
						</svg>
					</button>
			</div>
			<div class="totalLikes-div">
				<span>Total Likes:</span>
				<span class="totalLikes-counter">${totalLikes}</span>
			</div>
		</div>

		`
	);

	const likesBtn = document.querySelector('.likes-btn');
	likesBtn.addEventListener('click', () => {
		incrementLikes();
	});
}

function incrementLikes() {
	likes++;
	totalLikes++;
	console.log('totalLikes: ', totalLikes);
	const likesCounter = document.querySelector('.likes-counter');
	const totalLikesCounter = document.querySelector('.totalLikes-counter');
	likesCounter.textContent = likes;
	totalLikesCounter.textContent = totalLikes;
	likesToStorage();
}

function getLikesFromStorage() {
	// Пытаемся получить из хранилища лайки
	const profilesString = localStorage.getItem(likesTotalKey);
	console.log('profilesString: ', profilesString);
	// Если в хранилище их нет, то создаём со значением 0
	if (!profilesString) {
		localStorage.setItem(likesTotalKey, JSON.stringify(0));
	} else {
		totalLikes = JSON.parse(profilesString);
	}
}

function likesToStorage() {
	localStorage.setItem(likesTotalKey, JSON.stringify(totalLikes));
}

// Загрузка первой партии фотографий при загрузке страницы
loadMorePhotos();
