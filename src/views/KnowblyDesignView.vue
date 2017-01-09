<template>

    <div class="knowbly-design">
        <div class="typography">
            <h1><center>TYPOGRAPHY 400 / 600</center></h1>
            <template v-for="typography in typographyClasses">
                <table v-bind:class="typography.class">
                    <thead>
                        <tr>
                            <th colspan="4">{{typography.title}}</th>
                        </tr>
                        <tr>
                            <th>Regular</th>
                            <th>Regular Italic</th>
                            <th>Bold</th>
                            <th>Bold Italic</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>He who laughs most, learns best.<br/>— John Cleese</td>
                            <td><em>He who laughs most, learns best.<br/>— John Cleese</em></td>
                            <td><strong>He who laughs most, learns best.<br/>— John Cleese</strong></td>
                            <td><strong><em>He who laughs most, learns best.<br/>— John Cleese</em></strong></td>
                        </tr>
                        <tr>
                            <td colspan="4">
                                <strong>Sample Text:</strong> Lorem <u>ipsum</u> dolor <strong>sit</strong> amet, <strong><em>consectetur</em></strong> adipiscing elit. <em>Integer</em><sup>234</sup> nec odio<sub>(<u><em>12345<strong>6</strong></em></u>)</sub> Sed <strong>cursus</strong> ante <b>dapibus</b> diam. Sed <u>nisi.</u>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </template>
        </div>
        <br/>
        <br/>
        <br/>
        <br/>
        <div class="typography lighter">
            <h1><center>TYPOGRAPHY 300 / 400</center></h1>
            <template v-for="typography in typographyClasses">
                <table v-bind:class="typography.class">
                    <thead>
                        <tr>
                            <th colspan="4">{{typography.title}}</th>
                        </tr>
                        <tr>
                            <th>Regular</th>
                            <th>Regular Italic</th>
                            <th>Bold</th>
                            <th>Bold Italic</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>He who laughs most, learns best.<br/>— John Cleese</td>
                            <td><em>He who laughs most, learns best.<br/>— John Cleese</em></td>
                            <td><strong>He who laughs most, learns best.<br/>— John Cleese</strong></td>
                            <td><strong><em>He who laughs most, learns best.<br/>— John Cleese</em></strong></td>
                        </tr>
                        <tr>
                            <td colspan="4">
                                <strong>Sample Text:</strong> Lorem <u>ipsum</u> dolor <strong>sit</strong> amet, <strong><em>consectetur</em></strong> adipiscing elit. <em>Integer</em><sup>234</sup> nec odio<sub>(<u><em>12345<strong>6</strong></em></u>)</sub> Sed <strong>cursus</strong> ante <b>dapibus</b> diam. Sed <u>nisi.</u>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </template>
        </div>    
    </div>    
</template>
<script>

export default {
    name: 'knowblyDesignView',
    data () {
        return {
            typographyClasses: [
                {'class':'extra-large', 'title': 'EXTRA LARGE'},
                {'class':'large', 'title': 'LARGE'},
                {'class':'medium', 'title': 'MEDIUM'},
                {'class':'small', 'title': 'SMALL'},
                {'class':'extra-small', 'title': 'EXTRA SMALL'},
            ]
        }
    },
}
</script>