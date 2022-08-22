import './reactApp.jsx';
import '../stylesheets/main.scss';

//APIページなら以下実行
const pageurl = window.location.href;

if (pageurl === 'http://localhost:8080/api.html') {

  //位置情報の取得に成功したらajaxRequestファンクションを呼び出す
  function success(pos) {
    ajaxRequest(pos.coords.latitude, pos.coords.longitude); //緯度、経度、取得
  }
  function fail(error) {
    alert('位置情報の取得に失敗しました。エラーコード：' + error.code);
  }
  navigator.geolocation.getCurrentPosition(success, fail);

  //UTCをミリ秒に
  function utcToJSTime(utcTime) {
    return utcTime * 1000;
  }

  //天気予報データをリクエスト
  function ajaxRequest(lat, long) {
    const url = 'https://api.openweathermap.org/data/2.5/forecast';
    const appID = '1c21a6193cf343d98bb184d1c0d33223';

    $.ajax({
      url: url,
      data: {
        appid: appID, //API Key
        lat: lat, //緯度
        lon: long, //経度
        units: 'metric', //データの単位。metricにするとメートル法、摂氏(℃)のデータを取得出来る
        lang: 'ja' //言語を設定
      }
    })
      .done(function (data) {
        console.log(data);

        //都市名、国家
        $('#place').text(data.city.name + ',' + data.city.country);

        //天気予報データ
        data.list.forEach(function (forecast, index) {
          const dateTime = new Date(utcToJSTime(forecast.dt));
          const month = dateTime.getMonth() + 1;
          const date = dateTime.getDate();
          const hours = dateTime.getHours();
          const min = String(dateTime.getMinutes()).padStart(2, '0');
          const temperature = Math.round(forecast.main.temp);
          const description = forecast.weather[0].description;
          const iconPath = `src/images/${forecast.weather[0].icon}.svg`;

          console.log('日時:' + `${month}/${date} ${hours}:${min}`);
          console.log('気温:' + temperature);
          console.log('天気:' + description);
          console.log('画像パス:' + iconPath);

          //現在の天気とそれ以外を出力する
          if (index === 0) {
            const currentWeather = `
          <div class='icon'><img src='${iconPath}'></div>
          <div class='info'>
            <p>
              <span class='description'>現在の天気:${description}</span>
              <span class='temp'>${temperature}</span>℃
            </p>
          </div> `;
            $('#weather').html(currentWeather);
          } else {
            const tableRow = `
            <tr>
                <td class="info">
                    ${month}/${date} ${hours}:${min}
                </td>
                <td class="icon"><img src="${iconPath}"></td>
                <td><span class="description">${description}</span></td>
                <td><span class="temp">${temperature}°C</span></td>
            </tr>`;
            $('#forecast').append(tableRow);
          }
        })

      })
      .fail(function () {
        console.log('$.ajax faild!');
      })
  }
}
