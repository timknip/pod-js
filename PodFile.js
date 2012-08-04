/**
 *
 */
(function() {
    var PVRTMODELPOD_TAG_END = 0x80000000;
    
    PodFile = function(data) {
        this.data_ = data;
        this.pos_ = 0;
    };

    PodFile.prototype.read = function() {
        var marker = this.readMarker_();
        var scene;
        while (marker) {
            switch (marker.name) {
                case EPodFileName.ePODFileScene:
                    scene = this.readScene();
                    break;
                default:
                    this.pos_ += marker.len;
                    break;
            }
            marker = this.readMarker_();
        }
        return scene;
    };
    
    PodFile.prototype.readScene = function() {
        var s = new PodScene(),
            marker = this.readMarker_();
            
        while (marker) {
            switch (marker.name) {
                case (EPodFileName.ePODFileScene | PVRTMODELPOD_TAG_END):
                    return s;
                case EPodFileName.ePODFileNumCamera:
                    s.nNumCamera = this.readU32_();
                    break;
                case EPodFileName.ePODFileNumLight:
                    s.nNumLight = this.readU32_();
                    break;
                case EPodFileName.ePODFileNumMesh:
                    s.nNumMesh = this.readU32_();
                    break;
                case EPodFileName.ePODFileNumNode:
                    s.nNumNode = this.readU32_();
                    break;
                case EPodFileName.ePODFileNumMeshNode:
                    s.nNumMeshNode = this.readU32_();
                    break;
                case EPodFileName.ePODFileNumTexture:
                    s.nNumTexture = this.readU32_();
                    break;
                case EPodFileName.ePODFileNumMaterial:
                    s.nNumMaterial = this.readU32_();
                    break;
                case EPodFileName.ePODFileNumFrame:
                    s.nNumFrame = this.readU32_();
                    break;
                case EPodFileName.ePODFileFPS:
                    s.nFPS = this.readU32_();
                    break;
                case EPodFileName.ePODFileFlags:
                    s.nFlags = this.readU32_();
                    break;
                case EPodFileName.ePODFileCamera:
                    s.pCamera.push(this.readCamera());
                    break;
                case EPodFileName.ePODFileLight:
                    s.pLight.push(this.readLight());
                    break;
                case EPodFileName.ePODFileMaterial:
                    s.pMaterial.push(this.readMaterial());
                    break;
                case EPodFileName.ePODFileMesh:
                    s.pMesh.push(this.readMesh());
                    break;
                case EPodFileName.ePODFileNode:
                    s.pNode.push(this.readNode());
                    break;
                case EPodFileName.ePODFileTexture:
                    s.pTexture.push(this.readTexture());
                    break;
                default:
                    this.pos_ += marker.len;
                    break;
            }
            marker = this.readMarker_();
        }
        return s;
    };
    
    PodFile.prototype.readMesh = function() {
        var marker = this.readMarker_(),
            mesh = new PodMesh();
        while (marker) {
            switch (marker.name) {
                case (EPodFileName.ePODFileMesh | PVRTMODELPOD_TAG_END):
                    return mesh;
                case EPodFileName.ePODFileMeshNumVtx:
                    mesh.nNumVertices = this.readU32_();
                    break;
                case EPodFileName.ePODFileMeshNumFaces:
                    mesh.nNumFaces = this.readU32_();
                    break;
                case EPodFileName.ePODFileMeshNumUVW:
                    mesh.nNumUVW = this.readU32_();
                    break;
                case EPodFileName.ePODFileMeshStripLength:
                    mesh.pnStripLength = this.readArray32_(marker.len / 4);
                    break;
                case EPodFileName.ePODFileMeshNumStrips:
                    mesh.nNumStrips = this.readU32_();
                    break;
                case EPodFileName.ePODFileMeshInterleaved:
                    mesh.pInterleaved = this.readBytes_(marker.len);
                    break;
                case EPodFileName.ePODFileMeshUnpackMatrix:
                    mesh.mUnpackMatrix = this.readArray32_(16);
                    break;
                case EPodFileName.ePODFileMeshFaces:
                    mesh.sFaces = this.readCPODData(marker.name, true);
                    break;
                case EPodFileName.ePODFileMeshVtx:
                    mesh.sVertex = this.readCPODData(marker.name, (mesh.pInterleaved.length == 0));
                    break;
                case EPodFileName.ePODFileMeshNor:
                    mesh.sNormal = this.readCPODData(marker.name, (mesh.pInterleaved.length == 0));
                    break;
                case EPodFileName.ePODFileMeshTan:
                    mesh.sTangents = this.readCPODData(marker.name, (mesh.pInterleaved.length == 0));
                    break;
                case EPodFileName.ePODFileMeshBin:
                    mesh.sBinormals = this.readCPODData(marker.name, (mesh.pInterleaved.length == 0));
                    break;
                case EPodFileName.ePODFileMeshUVW:
                    var uvw = this.readCPODData(marker.name, (mesh.pInterleaved.length == 0));
                    mesh.psUVW.push(uvw);
                    break;
                default:
                    this.pos_ += marker.len;
                    break;
            }
            marker = this.readMarker_();
        }
    };
   
    PodFile.prototype.readCamera = function() {
        var marker = this.readMarker_(),
            s = new PodCamera();

        while (marker) {
            switch (marker.name) {
                case (EPodFileName.ePODFileCamera | PVRTMODELPOD_TAG_END):
                    return s;
                default:
                    this.pos_ += marker.len;
                    break;
            }
            marker = this.readMarker_();
        }
    };
    
    PodFile.prototype.readLight = function() {
        var marker = this.readMarker_(),
            s = new PodLight();

        while (marker) {
            switch (marker.name) {
                case (EPodFileName.ePODFileLight | PVRTMODELPOD_TAG_END):
                    return s;
                default:
                    this.pos_ += marker.len;
                    break;
            }
            marker = this.readMarker_();
        }
    };
    
    PodFile.prototype.readTexture = function() {
        var marker = this.readMarker_(),
            s = new PodTexture();

        while (marker) {
            switch (marker.name) {
                case (EPodFileName.ePODFileTexture | PVRTMODELPOD_TAG_END):
                    return s;
                case EPodFileName.ePODFileTexName:
                    s.pszName = this.readString_(marker.len);
                    break;
                default:
                    this.pos_ += marker.len;
                    break;
            }
            marker = this.readMarker_();
        }
    };
    
    PodFile.prototype.readMaterial = function() {
        var marker = this.readMarker_();
        var s = new PodMaterial();
        
        // Set texture IDs to -1
        s.nIdxTexDiffuse = -1;
        s.nIdxTexAmbient = -1;
        s.nIdxTexSpecularColour = -1;
        s.nIdxTexSpecularLevel = -1;
        s.nIdxTexBump = -1;
        s.nIdxTexEmissive = -1;
        s.nIdxTexGlossiness = -1;
        s.nIdxTexOpacity = -1;
        s.nIdxTexReflection = -1;
        s.nIdxTexRefraction = -1;
    	
        // Set defaults for blend modes
        s.eBlendSrcRGB = s.eBlendSrcA = EPODBlendFunc.ePODBlendFunc_ONE;
        s.eBlendDstRGB = s.eBlendDstA = EPODBlendFunc.ePODBlendFunc_ZERO;
        s.eBlendOpRGB  = s.eBlendOpA  = EPODBlendFunc.ePODBlendOp_ADD;

        // Set default for material flags
        s.nFlags = 0;

        // Set default for user data
        s.pUserData = null;
        s.nUserDataSize = 0;
    	       
        while (marker) {
            switch (marker.name) {
                case (EPodFileName.ePODFileMaterial | PVRTMODELPOD_TAG_END):
                    return s;
                case EPodFileName.ePODFileMatFlags:
                    s.nFlags = this.readU32_();
                    break;
                case EPodFileName.ePODFileMatName:
                    s.pszName = this.readString_(marker.len);
                    break;                
                case EPodFileName.ePODFileMatIdxTexDiffuse:
                    s.nIdxTexDiffuse = this.readU32_();
                    break;
                case EPodFileName.ePODFileMatIdxTexAmbient:
                    s.nIdxTexAmbient = this.readU32_();
                    break;
                case EPodFileName.ePODFileMatIdxTexSpecularColour:
                    s.nIdxTexSpecularColour = this.readU32_();
                    break;
                case EPodFileName.ePODFileMatIdxTexSpecularLevel:
                    s.nIdxTexSpecularLevel = this.readU32_();
                    break;
                case EPodFileName.ePODFileMatIdxTexBump:
                    s.nIdxTexBump = this.readU32_();
                    break;
                case EPodFileName.ePODFileMatIdxTexEmissive:
                    s.nIdxTexEmissive = this.readU32_();
                    break;
                case EPodFileName.ePODFileMatIdxTexGlossiness:
                    s.nIdxTexGlossiness = this.readU32_();
                    break;
                case EPodFileName.ePODFileMatIdxTexOpacity:
                    s.nIdxTexOpacity = this.readU32_();
                    break;
                case EPodFileName.ePODFileMatIdxTexReflection:
                    s.nIdxTexReflection = this.readU32_();
                    break;
                case EPodFileName.ePODFileMatIdxTexRefraction:
                    s.nIdxTexRefraction = this.readU32_();
                    break;
                case EPodFileName.ePODFileMatOpacity:
                    s.fMatOpacity = this.readU32_();
                    break;                        
                case EPodFileName.ePODFileMatAmbient:
                    s.pfMatAmbient = this.readArray32_(marker.len/4);
                    break;
                case EPodFileName.ePODFileMatDiffuse:
                    s.pfMatDiffuse = this.readArray32_(marker.len/4);
                    break;
                case EPodFileName.ePODFileMatSpecular:
                    s.pfMatSpecular = this.readArray32_(marker.len/4);
                    break;
                case EPodFileName.ePODFileMatShininess:
                    s.fMatShininess = this.readU32_();
                    break;
                case EPodFileName.ePODFileMatEffectFile:
                    s.pszEffectFile = this.readString_(marker.len);
                    break;
                case EPodFileName.ePODFileMatEffectName:
                    s.pszEffectName = this.readString_(marker.len);
                    break;
                case EPodFileName.ePODFileMatBlendSrcRGB:
                    s.eBlendSrcRGB = this.readU32_();
                    break;
                case EPodFileName.ePODFileMatBlendSrcA:
                    s.eBlendSrcA = this.readU32_();
                    break;
                case EPodFileName.ePODFileMatBlendDstRGB:
                    s.eBlendDstRGB = this.readU32_();
                    break;
                case EPodFileName.ePODFileMatBlendDstA:
                    s.eBlendDstA = this.readU32_();
                    break;
                case EPodFileName.ePODFileMatBlendOpRGB:
                    s.eBlendOpRGB = this.readU32_();
                    break;
                case EPodFileName.ePODFileMatBlendOpA:
                    s.eBlendOpA = this.readU32_();
                    break;
                case EPodFileName.ePODFileMatBlendColour:
                    s.pfBlendColour = this.readArray32_(marker.len / 4);
                    break;
                case EPodFileName.ePODFileMatBlendFactor:
                    s.pfBlendFactor = this.readArray32_(marker.len / 4);
                    break;
                case EPodFileName.ePODFileMatUserData:
                    s.pUserData = this.readString_(marker.len);
                    break;
                default:
                    this.pos_ += marker.len;
                    break;
            }
            marker = this.readMarker_();
        }
    };
    
    PodFile.prototype.readNode = function() {
        var marker = this.readMarker_(),
            s = new PodNode(),
            bOldNodeFormat = false,
            fPos = null,
            fQuat = null,
            fScale = null;
        
        s.nAnimFlags = 0;
        
        while (marker) {
            switch (marker.name) {
                case (EPodFileName.ePODFileNode | PVRTMODELPOD_TAG_END):
                    if (bOldNodeFormat) {
                        if(s.pfAnimPosition) {
                            s.nAnimFlags |= EPODAnimationData.ePODHasPositionAni;
                        } else {
                            s.pfAnimPosition = fPos;
                        }
                        if(s.pfAnimRotation) {
                            s.nAnimFlags |= EPODAnimationData.ePODHasRotationAni;
                        } else {
                            s.pfAnimRotation = fQuat;
                        }
                        if(s.pfAnimScale) {
                            s.nAnimFlags |= EPODAnimationData.ePODHasScaleAni;
                        } else {
                            s.pfAnimScale = fScale;
                        }
                    }
                    return s;
                case EPodFileName.ePODFileNodeIdx:
                    s.nIdx = this.readU32_();
                    break;
                case EPodFileName.ePODFileNodeName:
                    s.pszName = this.readString_(marker.len);
                    break;
                case EPodFileName.ePODFileNodeIdxMat:
                    s.nIdxMaterial = this.readU32_();
                    break;
                case EPodFileName.ePODFileNodeIdxParent:
                    s.nIdxParent = this.readU32_();
                    break;
                case EPodFileName.ePODFileNodeAnimFlags:
                    s.nAnimFlags = this.readU32_();
                    break;
                case EPodFileName.ePODFileNodeAnimPosIdx:
                    s.pnAnimPositionIdx = this.readArray32_(marker.len/4);
                    break;
                case EPodFileName.ePODFileNodeAnimPos:
                    s.pfAnimPosition = this.readArray32_(marker.len/4);
                    break;
                case EPodFileName.ePODFileNodeAnimRotIdx:
                    s.pnAnimRotationIdx = this.readArray32_(marker.len/4);
                    break;
                case EPodFileName.ePODFileNodeAnimRot:
                    s.pfAnimRotation = this.readArray32_(marker.len/4);
                    break;
                case EPodFileName.ePODFileNodeAnimScaleIdx:
                    s.pnAnimScaleIdx = this.readArray32_(marker.len/4);
                    break;
                case EPodFileName.ePODFileNodeAnimScale:
                    s.pfAnimScale = this.readArray32_(marker.len/4);
                    break;
                case EPodFileName.ePODFileNodeAnimMatrixIdx:
                    s.pnAnimMatrixIdx = this.readArray32_(marker.len/4);
                    break;
                case EPodFileName.ePODFileNodeAnimMatrix:
                    s.pfAnimMatrix = this.readArray32_(marker.len/4);
                    break;
                // Parameters from the older pod format
                case EPodFileName.ePODFileNodePos:
                    fPos = this.readArray32_(marker.len/4);
                    bOldNodeFormat = true;
                    break;
                case EPodFileName.ePODFileNodeRot:
                    fQuat = this.readArray32_(marker.len/4);
                    bOldNodeFormat = true;
                    break;
                case EPodFileName.ePODFileNodeScale:
                    fScale = this.readArray32_(marker.len/4);
                    bOldNodeFormat = true;
                    break;
                default:
                    this.pos_ += marker.len;
                    break;
            }
            marker = this.readMarker_();
        }
    };
    
    PodFile.prototype.readCPODData = function(nSpec, bValidData) {
        var marker = this.readMarker_();
        var data = new CPODData();
        
        while (marker) {
            switch (marker.name) {
                case (nSpec | PVRTMODELPOD_TAG_END):
                    return data;
                case EPodFileName.ePODFileDataType:
                    data.eType = this.readU32_();
                    break;
                case EPodFileName.ePODFileN:
                    data.n = this.readU32_();
                    break;
                case EPodFileName.ePODFileStride:
                    data.nStride = this.readU32_();
                    break;
                case EPodFileName.ePODFileData:
                    if (bValidData) {
                        switch(PVRTModelPODDataTypeSize(data.eType)) {
                            case 1:
                                data.pData = this.readBytes_(marker.len);
                                break;
                            case 2:
                                data.pData = [];
                                for (var i = 0; i < marker.len / 2; i++) {
                                    data.pData.push(this.readU16_());
                                }
                                break;
                            case 4:
                                data.pData = [];
                                for (var i = 0; i < marker.len / 4; i++) {
                                    data.pData.push(this.readU32_());
                                }
                                break;
                            default:
                                break;
                        }
                    } else {
                        data.pData = this.readBytes_(4);
                    }
                    break;
                default:
                    this.pos_ += marker.len;
                    break;
            }
            marker = this.readMarker_();
        }
    };
    
    PodFile.prototype.readMarker_ = function() {
        if (this.pos_ + 8 >= this.data_.length - 1) {
            return null;
        }
        return {
            name: this.readU32_(),
            len: this.readU32_()
        };
    };
    
    PodFile.prototype.readBytes_ = function(num) {
        var bytes = [];
        for (var i = 0; i < num; i++) {
            bytes.push(this.data_[this.pos_++]);
        }
        return bytes;
    };
    
    PodFile.prototype.readU16_ = function() {
        var ub = this.readBytes_(2);
        return ((ub[1] << 8) | ub[0]);
    };
    
    PodFile.prototype.readU32_ = function() {
        var ub = this.readBytes_(4);
        return ((ub[3] << 24) | (ub[2] << 16) | (ub[1] << 8) | ub[0]);
    };
    
    PodFile.prototype.readArray16_ = function(len) {
        var result = [];
        for (var i = 0; i < len; i++) {
            result.push(this.readU16_());
        }
        return result;
    };
    
    PodFile.prototype.readArray32_ = function(len) {
        var result = [];
        for (var i = 0; i < len; i++) {
            result.push(this.readU32_());
        }
        return result;
    };
    
    PodFile.prototype.readString_ = function(num) {
        var bytes = this.readBytes_(num),
            s = "";
        for (var i = 0; i < num; i++) {
            s += String.fromCharCode(bytes[i]);
        }
        return s;
    };
    
    PodScene = function() {
        this.nNumCamera = 0;
        this.nNumLight = 0;
        this.nNumMesh = 0;
        this.nNumNode = 0;
        this.nNumMeshNode = 0;
        this.nNumTexture = 0;
        this.nNumMaterial = 0;
        this.nNumFrame = 0;
        this.nFPS = 0;
        this.nFlags = 0;
        this.pCamera = [];
        this.pLight = [];
        this.pMaterial = [];
        this.pMesh = [];
        this.pNode = [];
        this.pTexture = [];
    };
    
    PodCamera = function() {
        this.nIdxTarget;    /*!< Index of the target object */
        this.fFOV;          /*!< Field of view */
        this.fFar;          /*!< Far clip plane */
        this.fNear;         /*!< Near clip plane */
        this.pfAnimFOV;     /*!< 1 VERTTYPE per frame of animation. */
    };
    
    PodLight = function() {
        this.nIdxTarget;            /*!< Index of the target object */
        this.pfColour;              /*!< Light colour (0.0f -> 1.0f for each channel) */
        this.eType;                 /*!< Light type (point, directional, spot etc.) */
        this.fConstantAttenuation;  /*!< Constant attenuation */
        this.fLinearAttenuation;    /*!< Linear atternuation */
        this.fQuadraticAttenuation; /*!< Quadratic attenuation */
        this.fFalloffAngle;         /*!< Falloff angle (in radians) */
        this.fFalloffExponent;      /*!< Falloff exponent */
    };
    
    PodTexture = function() {
        this.pszName = "";
    };
    
    PodMaterial = function() {
        this.pszName = "";          /*!< Name of material */
        this.nIdxTexDiffuse;        /*!< Idx into pTexture for the diffuse texture */
        this.nIdxTexAmbient;        /*!< Idx into pTexture for the ambient texture */
        this.nIdxTexSpecularColour; /*!< Idx into pTexture for the specular colour texture */
        this.nIdxTexSpecularLevel;  /*!< Idx into pTexture for the specular level texture */
        this.nIdxTexBump;           /*!< Idx into pTexture for the bump map */
        this.nIdxTexEmissive;       /*!< Idx into pTexture for the emissive texture */
        this.nIdxTexGlossiness;     /*!< Idx into pTexture for the glossiness texture */
        this.nIdxTexOpacity;        /*!< Idx into pTexture for the opacity texture */
        this.nIdxTexReflection;     /*!< Idx into pTexture for the reflection texture */
        this.nIdxTexRefraction;     /*!< Idx into pTexture for the refraction texture */
        this.fMatOpacity;           /*!< Material opacity (used with vertex alpha ?) */
        this.pfMatAmbient;          /*!< Ambient RGB value */
        this.pfMatDiffuse;          /*!< Diffuse RGB value */
        this.pfMatSpecular;         /*!< Specular RGB value */
        this.fMatShininess;         /*!< Material shininess */
        this.pszEffectFile;         /*!< Name of effect file */
        this.pszEffectName;         /*!< Name of effect in the effect file */
        this.eBlendSrcRGB;          /*!< Blending RGB source value */
        this.eBlendSrcA;            /*!< Blending alpha source value */
        this.eBlendDstRGB;          /*!< Blending RGB destination value */
        this.eBlendDstA;            /*!< Blending alpha destination value */
        this.eBlendOpRGB;           /*!< Blending RGB operation */
        this.eBlendOpA;             /*!< Blending alpha operation */
        this.pfBlendColour;         /*!< A RGBA colour to be used in blending */
        this.pfBlendFactor;         /*!< An array of blend factors, one for each RGBA component */
        this.nFlags = 0;            /*!< Stores information about the material e.g. Enable blending */
        this.nUserDataSize;
        this.pUserData;
    };
    
    PodMesh = function() {
        this.nNumVertex = 0;        /*!< Number of vertices in the mesh */
        this.nNumFaces = 0;         /*!< Number of triangles in the mesh */
        this.nNumUVW = 0;           /*!< Number of texture coordinate channels per vertex */
        this.sFaces = null;         /*!< List of triangle indices */
        this.pnStripLength = [];    /*!< If mesh is stripped: number of tris per strip. */
        this.nNumStrips = 0;        /*!< If mesh is stripped: number of strips, length of pnStripLength array. */
        this.sVertex = null;        /*!< List of vertices (x0, y0, z0, x1, y1, z1, x2, etc...) */
        this.sNormals = null;       /*!< List of vertex normals (Nx0, Ny0, Nz0, Nx1, Ny1, Nz1, Nx2, etc...) */
        this.sTangents = null;      /*!< List of vertex tangents (Tx0, Ty0, Tz0, Tx1, Ty1, Tz1, Tx2, etc...) */
        this.sBinormals = null;     /*!< List of vertex binormals (Bx0, By0, Bz0, Bx1, By1, Bz1, Bx2, etc...) */
        this.psUVW = [];            /*!< List of UVW coordinate sets; size of array given by 'nNumUVW' */
        this.sVtxColours = null;    /*!< A colour per vertex */
        this.sBoneIdx = null;       /*!< nNumBones*nNumVertex ints (Vtx0Idx0, Vtx0Idx1, ... Vtx1Idx0, Vtx1Idx1, ...) */
        this.sBoneWeight = null;    /*!< nNumBones*nNumVertex floats (Vtx0Wt0, Vtx0Wt1, ... Vtx1Wt0, Vtx1Wt1, ...) */
        this.pInterleaved = [];     /*!< Interleaved vertex data */
        this.sBoneBatches = null;   /*!< Bone tables */
        this.ePrimitiveType = 0;    /*!< Primitive type used by this mesh */
        this.mUnpackMatrix = [];    /*!< A matrix used for unscaling scaled vertex data 
                                         created with PVRTModelPODScaleAndConvertVtxData*/
    };

    PodNode = function() {
        this.nIdx = -1;                 /*!< Index into mesh, light or camera array, depending on which object list contains this Node */
        this.pszName = '';              /*!< Name of object */
        this.nIdxMaterial = -1;         /*!< Index of material used on this mesh */
        this.nIdxParent = -1;           /*!< Index into MeshInstance array; recursively apply ancestor's transforms after this instance's. */
        this.nAnimFlags = 0;            /*!< Stores which animation arrays the POD Node contains */
        this.pnAnimPositionIdx = 1;
        this.pfAnimPosition = null;     /*!< 3 floats per frame of animation. */
        this.pnAnimRotationIdx = -1;
        this.pfAnimRotation = null;     /*!< 7 floats per frame of animation. */
        this.pnAnimMatrixIdx = -1;
        this.pfAnimMatrix = null;       /*!< 16 floats per frame of animation. */
        this.nUserDataSize = 0;
        this.pUserData = null;
    };
    
    CPODData = function() {
        this.eType = 0;
        this.n = 0;
        this.nStride = 0;
        this.pData = 0;
    };
    
    EPodFileName = {
        ePODFileVersion: 1000,
        ePODFileScene: 1001,
        ePODFileExpOpt: 1002,
        ePODFileHistory: 1003,
        
        ePODFileColourBackground: 2000,
        ePODFileColourAmbient: 2001,
        ePODFileNumCamera: 2002,
        ePODFileNumLight: 2003,
        ePODFileNumMesh: 2004,
        ePODFileNumNode: 2005,
        ePODFileNumMeshNode: 2006,
        ePODFileNumTexture: 2007,
        ePODFileNumMaterial: 2008,
        ePODFileNumFrame: 2009,
        ePODFileCamera: 2010,     // Will come multiple times
        ePODFileLight: 2011,      // Will come multiple times
        ePODFileMesh: 2012,       // Will come multiple times
        ePODFileNode: 2013,       // Will come multiple times
        ePODFileTexture: 2014,    // Will come multiple times
        ePODFileMaterial: 2015,   // Will come multiple times
        ePODFileFlags: 2016,
        ePODFileFPS: 2017,
        ePODFileUserData: 2018,
        
        ePODFileMatName: 3000,
        ePODFileMatIdxTexDiffuse: 3001,
        ePODFileMatOpacity: 3002,
        ePODFileMatAmbient: 3003,
        ePODFileMatDiffuse: 3004,
        ePODFileMatSpecular: 3005,
        ePODFileMatShininess: 3006,
        ePODFileMatEffectFile: 3007,
        ePODFileMatEffectName: 3008,
        ePODFileMatIdxTexAmbient: 3009,
        ePODFileMatIdxTexSpecularColour: 3010,
        ePODFileMatIdxTexSpecularLevel: 3011,
        ePODFileMatIdxTexBump: 3012,
        ePODFileMatIdxTexEmissive: 3013,
        ePODFileMatIdxTexGlossiness: 3014,
        ePODFileMatIdxTexOpacity: 3015,
        ePODFileMatIdxTexReflection: 3016,
        ePODFileMatIdxTexRefraction: 3017,
        ePODFileMatBlendSrcRGB: 3018,
        ePODFileMatBlendSrcA: 3019,
        ePODFileMatBlendDstRGB: 3020,
        ePODFileMatBlendDstA: 3021,
        ePODFileMatBlendOpRGB: 3022,
        ePODFileMatBlendOpA: 3023,
        ePODFileMatBlendColour: 3024,
        ePODFileMatBlendFactor: 3025,
        ePODFileMatFlags: 3026,
        ePODFileMatUserData: 3027,

        ePODFileTexName: 4000,

        ePODFileNodeIdx: 5000,
        ePODFileNodeName: 5001,
        ePODFileNodeIdxMat: 5002,
        ePODFileNodeIdxParent: 5003,
        ePODFileNodePos: 5004,
        ePODFileNodeRot: 5005,
        ePODFileNodeScale: 5006,
        ePODFileNodeAnimPos: 5007,
        ePODFileNodeAnimRot: 5008,
        ePODFileNodeAnimScale: 5009,
        ePODFileNodeMatrix: 5010,
        ePODFileNodeAnimMatrix: 5011,
        ePODFileNodeAnimFlags: 5012,
        ePODFileNodeAnimPosIdx: 5013,
        ePODFileNodeAnimRotIdx: 5014,
        ePODFileNodeAnimScaleIdx: 5015,
        ePODFileNodeAnimMatrixIdx: 5016,
        ePODFileNodeUserData: 5017,

        ePODFileMeshNumVtx: 6000,
        ePODFileMeshNumFaces: 6001,
        ePODFileMeshNumUVW: 6002,
        ePODFileMeshFaces: 6003,
        ePODFileMeshStripLength: 6004,
        ePODFileMeshNumStrips: 6005,
        ePODFileMeshVtx: 6006,
        ePODFileMeshNor: 6007,
        ePODFileMeshTan: 6008,
        ePODFileMeshBin: 6009,
        ePODFileMeshUVW: 6010,            // Will come multiple times
        ePODFileMeshVtxCol: 6011,
        ePODFileMeshBoneIdx: 6012,
        ePODFileMeshBoneWeight: 6013,
        ePODFileMeshInterleaved: 6014,
        ePODFileMeshBoneBatches: 6015,
        ePODFileMeshBoneBatchBoneCnts: 6016,
        ePODFileMeshBoneBatchOffsets: 6017,
        ePODFileMeshBoneBatchBoneMax: 6018,
        ePODFileMeshBoneBatchCnt: 6019,
        ePODFileMeshUnpackMatrix: 6020,

        ePODFileLightIdxTgt: 7000,
        ePODFileLightColour: 7001,
        ePODFileLightType: 7002,
        ePODFileLightConstantAttenuation: 7003,
        ePODFileLightLinearAttenuation: 7004,
        ePODFileLightQuadraticAttenuation: 7005,
        ePODFileLightFalloffAngle: 7006,
        ePODFileLightFalloffExponent: 7007,

        ePODFileCamIdxTgt: 8000,
        ePODFileCamFOV: 8001,
        ePODFileCamFar: 8002,
        ePODFileCamNear: 8003,
        ePODFileCamAnimFOV: 8004,

        ePODFileDataType: 9000,
        ePODFileN: 9001,
        ePODFileStride: 9002,
        ePODFileData: 9003
    };
    
    EPVRTDataType = {
        EPODDataNone: 0,
        EPODDataFloat: 1,
        EPODDataInt: 2,
        EPODDataUnsignedShort: 3,
        EPODDataRGBA: 4,
        EPODDataARGB: 5,
        EPODDataD3DCOLOR: 6,
        EPODDataUBYTE4: 7,
        EPODDataDEC3N: 8,
        EPODDataFixed16_16: 9,
        EPODDataUnsignedByte: 10,
        EPODDataShort: 11,
        EPODDataShortNorm: 12,
        EPODDataByte: 13,
        EPODDataByteNorm: 14,
        EPODDataUnsignedByteNorm: 15,
        EPODDataUnsignedShortNorm: 16,
        EPODDataUnsignedInt: 17
    };
    
    EPODPrimitiveType = {
        ePODTriangles: 0,
        eNumPODPrimitiveTypes: 1
    };
    
    EPODBlendFunc = {
        ePODBlendFunc_ZERO: 0,
        ePODBlendFunc_ONE: 1,
        ePODBlendFunc_BLEND_FACTOR: 2,
        ePODBlendFunc_ONE_MINUS_BLEND_FACTOR: 3,
        ePODBlendFunc_SRC_COLOR: 0x0300,
        ePODBlendFunc_ONE_MINUS_SRC_COLOR: 0x0301,
        ePODBlendFunc_SRC_ALPHA: 0x0302,
        ePODBlendFunc_ONE_MINUS_SRC_ALPHA: 0x0303,
        ePODBlendFunc_DST_ALPHA: 0x0304,
        ePODBlendFunc_ONE_MINUS_DST_ALPHA: 0x0305,
        ePODBlendFunc_DST_COLOR: 0x0306,
        ePODBlendFunc_ONE_MINUS_DST_COLOR: 0x0307,
        ePODBlendFunc_SRC_ALPHA_SATURATE: 0x0308,
        ePODBlendFunc_CONSTANT_COLOR: 0x8001,
        ePODBlendFunc_ONE_MINUS_CONSTANT_COLOR: 0x8002,
        ePODBlendFunc_CONSTANT_ALPHA: 0x8003,
        ePODBlendFunc_ONE_MINUS_CONSTANT_ALPHA: 0x8004
    };
    
    EPODAnimationData = {
        ePODHasPositionAni: 0x01,   /*!< Position animation */
        ePODHasRotationAni: 0x02,   /*!< Rotation animation */
        ePODHasScaleAni: 0x04,      /*!< Scale animation */
        ePODHasMatrixAni: 0x08      /*!< Matrix animation */
    };
    
    var PVRTModelPODDataTypeSize = function(type) {
        switch(type)
        {
            case EPVRTDataType.EPODDataFloat:
            case EPVRTDataType.EPODDataInt:
            case EPVRTDataType.EPODDataUnsignedInt:
                return 4;
            case EPVRTDataType.EPODDataShort:
            case EPVRTDataType.EPODDataShortNorm:
            case EPVRTDataType.EPODDataUnsignedShort:
            case EPVRTDataType.EPODDataUnsignedShortNorm:
                return 2;
            case EPVRTDataType.EPODDataRGBA:
            case EPVRTDataType.EPODDataARGB:
            case EPVRTDataType.EPODDataD3DCOLOR:
            case EPVRTDataType.EPODDataUBYTE4:
            case EPVRTDataType.EPODDataDEC3N:
            case EPVRTDataType.EPODDataFixed16_16:
                return 4;
            case EPVRTDataType.EPODDataUnsignedByte:
            case EPVRTDataType.EPODDataUnsignedByteNorm:
            case EPVRTDataType.EPODDataByte:
            case EPVRTDataType.EPODDataByteNorm:
                return 1;
            default:
                return 0;
        }
    };
})();
